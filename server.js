require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
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
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin middleware
function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
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

// Submit admission form (public)
app.post('/api/admission', async (req, res) => {
  try {
    const {
      studentName, fatherName, motherName, dob, gender, email, phone,
      address, previousSchool, classApplying, bloodGroup
    } = req.body;
    
    await pool.query(
      `INSERT INTO admissions 
      (student_name, father_name, mother_name, dob, gender, email, phone, 
       address, previous_school, class_applying, blood_group, submitted_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [studentName, fatherName, motherName, dob, gender, email, phone, 
       address, previousSchool, classApplying, bloodGroup]
    );
    
    res.json({ success: true, message: 'Admission form submitted successfully!' });
  } catch (error) {
    console.error('Admission error:', error);
    res.status(500).json({ error: 'Failed to submit admission form' });
  }
});

// Submit contact form (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
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

// Download admission PDF (admin)
app.get('/api/admin/admission-pdf/:id', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admissions WHERE id = ?', [req.params.id]);
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    
    const admission = rows[0];
    
    // Format date for display
    const formattedDate = new Date(admission.submitted_at).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Prepare data for PDF
    const pdfData = {
      id: admission.id,
      student_name: admission.student_name,
      father_name: admission.father_name,
      mother_name: admission.mother_name,
      dob: new Date(admission.dob).toLocaleDateString('en-IN'),
      gender: admission.gender,
      email: admission.email,
      phone: admission.phone,
      address: admission.address,
      previous_school: admission.previous_school || 'N/A',
      class_applying: admission.class_applying,
      blood_group: admission.blood_group || 'N/A',
      submitted_at: formattedDate
    };
    
    // Generate temporary file path
    const tempFilePath = path.join(__dirname, `temp_admission_${admission.id}.pdf`);
    
    // Call Python script to generate PDF
    const pythonScript = path.join(__dirname, 'generate_admission_pdf.py');
    const jsonData = JSON.stringify(pdfData);
    
    exec(`python3 "${pythonScript}" '${jsonData}' "${tempFilePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('PDF generation error:', error);
        console.error('stderr:', stderr);
        return res.status(500).json({ error: 'Failed to generate PDF' });
      }
      
      // Send PDF file
      res.download(tempFilePath, `admission_form_${admission.id}.pdf`, (err) => {
        // Delete temp file after sending
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) console.error('Failed to delete temp file:', unlinkErr);
        });
        
        if (err) {
          console.error('Download error:', err);
        }
      });
    });
  } catch (error) {
    console.error('PDF endpoint error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// News CRUD (admin)
app.post('/api/admin/news', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
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
});
