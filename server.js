require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Connected');
    conn.release();
  })
  .catch(err => console.error('❌ MySQL Error:', err.message));

/* ===============================
   ADMIN AUTHENTICATION
=============================== */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    
    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'secret-key-change-in-production',
      { expiresIn: '24h' }
    );
    
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
app.post('/api/auth/change-password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin = rows[0];
    
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.admin.id]);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Admin middleware
function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-change-in-production');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/* ===============================
   PUBLIC ENDPOINTS
=============================== */

// Get all news (public)
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY date DESC LIMIT 10');
    res.json(rows);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [admissionCount] = await pool.query('SELECT COUNT(*) as count FROM admissions');
    const [newsCount] = await pool.query('SELECT COUNT(*) as count FROM news');
    const [contactCount] = await pool.query('SELECT COUNT(*) as count FROM contacts');
    
    res.json({
      admissions: admissionCount[0].count,
      news: newsCount[0].count,
      contacts: contactCount[0].count
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Submit admission form (public)
app.post('/api/admission', async (req, res) => {
  try {
    const {
      studentName, fatherName, motherName, dob, gender, email, phone,
      address, previousSchool, classApplying, bloodGroup
    } = req.body;
    
    // Validate required fields
    if (!studentName || !fatherName || !motherName || !dob || !gender || 
        !email || !phone || !address || !classApplying) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO admissions 
      (student_name, father_name, mother_name, dob, gender, email, phone, 
       address, previous_school, class_applying, blood_group, submitted_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [studentName, fatherName, motherName, dob, gender, email, phone, 
       address, previousSchool || '', classApplying, bloodGroup || '']
    );
    
    res.json({ 
      success: true, 
      message: 'Admission form submitted successfully!',
      admissionId: result.insertId
    });
  } catch (error) {
    console.error('Admission error:', error);
    res.status(500).json({ error: 'Failed to submit admission form' });
  }
});

// Submit contact form (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message, submitted_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, subject, message]
    );
    
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/* ===============================
   ADMIN ENDPOINTS
=============================== */

// Get all admissions (admin)
app.get('/api/admin/admissions', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admissions ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get admissions error:', error);
    res.status(500).json({ error: 'Failed to fetch admissions' });
  }
});

// Get all contacts (admin)
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Delete admission (admin)
app.delete('/api/admin/admissions/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM admissions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Admission deleted' });
  } catch (error) {
    console.error('Delete admission error:', error);
    res.status(500).json({ error: 'Failed to delete admission' });
  }
});

// Delete contact (admin)
app.delete('/api/admin/contacts/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Generate PDF for admission (Pure Node.js - NO PYTHON!)
app.get('/api/admin/admission-pdf/:id', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admissions WHERE id = ?', [req.params.id]);
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    
    const admission = rows[0];
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=admission_${admission.id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Helper functions
    const drawBox = (y, height) => {
      doc.rect(50, y, 495, height).stroke();
    };
    
    const addField = (label, value, x, y, width = 200) => {
      doc.fontSize(9).fillColor('#666666').text(label, x, y);
      doc.fontSize(11).fillColor('#000000').text(value || 'N/A', x, y + 12, { width });
    };
    
    // Header with logo
    doc.fontSize(24).fillColor('#1a365d').text('🛡️', 270, 50);
    doc.fontSize(20).fillColor('#1a365d').text('SAINIK DEFENSE COLLEGE', 120, 80, { align: 'center' });
    doc.fontSize(11).fillColor('#666666').text('Hingonia, Jaipur, Rajasthan - 302026', 50, 105, { align: 'center', width: 495 });
    doc.fontSize(10).text('Affiliated to CBSE, New Delhi', 50, 120, { align: 'center', width: 495 });
    
    // Underline
    doc.moveTo(50, 135).lineTo(545, 135).stroke();
    
    // Title
    doc.rect(50, 145, 495, 30).fillAndStroke('#1a365d', '#1a365d');
    doc.fontSize(14).fillColor('#ffffff').text('ADMISSION FORM', 50, 155, { align: 'center', width: 495 });
    
    // Application Info Box
    let yPos = 185;
    drawBox(yPos, 50);
    doc.fontSize(10).fillColor('#1a365d').text('Application Details', 60, yPos + 10);
    addField('Application ID:', `#${admission.id}`, 60, yPos + 25);
    addField('Submission Date:', new Date(admission.submitted_at).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }), 260, yPos + 25);
    
    // Student Information Section
    yPos += 65;
    doc.rect(50, yPos, 495, 25).fillAndStroke('#dbeafe', '#3b82f6');
    doc.fontSize(12).fillColor('#1a365d').text('STUDENT INFORMATION', 60, yPos + 7);
    
    yPos += 30;
    drawBox(yPos, 130);
    addField('Student Name:', admission.student_name, 60, yPos + 10, 180);
    addField('Date of Birth:', new Date(admission.dob).toLocaleDateString('en-IN'), 300, yPos + 10);
    
    addField('Father\'s Name:', admission.father_name, 60, yPos + 45, 180);
    addField('Gender:', admission.gender, 300, yPos + 45);
    
    addField('Mother\'s Name:', admission.mother_name, 60, yPos + 80, 180);
    addField('Blood Group:', admission.blood_group || 'N/A', 300, yPos + 80);
    
    // Academic Information
    yPos += 145;
    doc.rect(50, yPos, 495, 25).fillAndStroke('#dbeafe', '#3b82f6');
    doc.fontSize(12).fillColor('#1a365d').text('ACADEMIC INFORMATION', 60, yPos + 7);
    
    yPos += 30;
    drawBox(yPos, 65);
    addField('Class Applying For:', admission.class_applying, 60, yPos + 10);
    addField('Previous School:', admission.previous_school || 'N/A', 60, yPos + 45, 430);
    
    // Contact Information
    yPos += 80;
    doc.rect(50, yPos, 495, 25).fillAndStroke('#dbeafe', '#3b82f6');
    doc.fontSize(12).fillColor('#1a365d').text('CONTACT INFORMATION', 60, yPos + 7);
    
    yPos += 30;
    drawBox(yPos, 100);
    addField('Email Address:', admission.email, 60, yPos + 10, 180);
    addField('Phone Number:', admission.phone, 300, yPos + 10);
    addField('Residential Address:', admission.address, 60, yPos + 45, 430);
    
    // Office Use Section
    yPos += 115;
    doc.rect(50, yPos, 495, 25).fillAndStroke('#fef3c7', '#f59e0b');
    doc.fontSize(12).fillColor('#92400e').text('FOR OFFICE USE ONLY', 60, yPos + 7);
    
    yPos += 30;
    drawBox(yPos, 130);
    doc.fontSize(9).fillColor('#666666').text('Admission Status: ☐ Approved   ☐ Pending   ☐ Rejected', 60, yPos + 10);
    doc.text('Interview Date: _______________________', 60, yPos + 30);
    doc.text('Admission Fee: ☐ Paid   ☐ Pending     Amount: ₹ __________', 60, yPos + 50);
    doc.text('Receipt Number: _______________________', 60, yPos + 70);
    doc.text('Admitted to Class: ____________________     Roll Number: __________', 60, yPos + 90);
    
    // Signature Section
    yPos += 150;
    doc.fontSize(9).fillColor('#000000');
    doc.text('_______________________', 70, yPos);
    doc.text('_______________________', 230, yPos);
    doc.text('_______________________', 390, yPos);
    doc.fontSize(8).fillColor('#666666');
    doc.text('Parent/Guardian', 85, yPos + 15);
    doc.text('Admission Officer', 245, yPos + 15);
    doc.text('Principal', 425, yPos + 15);
    
    // Footer
    doc.fontSize(7).fillColor('#999999');
    doc.text('_'.repeat(120), 50, yPos + 40);
    doc.text('Sainik Defense College, Hingonia, Jaipur | Ph: +91 9928889381 | Email: admissions@sainikdefense.com', 50, yPos + 45, { align: 'center', width: 495 });
    doc.text(`Document Generated: ${new Date().toLocaleString('en-IN')}`, 50, yPos + 55, { align: 'center', width: 495 });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// News CRUD (admin)
app.post('/api/admin/news', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    await pool.query(
      'INSERT INTO news (title, content, date) VALUES (?, ?, NOW())',
      [title, content]
    );
    res.json({ success: true, message: 'News created' });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Failed to create news' });
  }
});

app.put('/api/admin/news/:id', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    await pool.query(
      'UPDATE news SET title = ?, content = ?, date = NOW() WHERE id = ?',
      [title, content, req.params.id]
    );
    res.json({ success: true, message: 'News updated' });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

app.delete('/api/admin/news/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'News deleted' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// Dashboard stats
app.get('/api/admin/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const [totalAdmissions] = await pool.query('SELECT COUNT(*) as count FROM admissions');
    const [totalContacts] = await pool.query('SELECT COUNT(*) as count FROM contacts');
    const [totalNews] = await pool.query('SELECT COUNT(*) as count FROM news');
    const [recentAdmissions] = await pool.query('SELECT COUNT(*) as count FROM admissions WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    
    res.json({
      totalAdmissions: totalAdmissions[0].count,
      totalContacts: totalContacts[0].count,
      totalNews: totalNews[0].count,
      recentAdmissions: recentAdmissions[0].count
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/* ===============================
   SERVE FRONTEND
=============================== */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ===============================
   START SERVER
=============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Local: http://localhost:${PORT}`);
});
