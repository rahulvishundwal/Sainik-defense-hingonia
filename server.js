require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

/* ===============================
   MIDDLEWARE
=============================== */
app.use(cors());
app.use(express.json());

/* ===============================
   DATABASE CONNECTION
=============================== */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false
});

// Test DB
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Error:", err.message);
  }
})();

/* ===============================
   AUTH ROUTES
=============================== */

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    if (!rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password);

    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: { id: admin.id, email: admin.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-key"
    );

    req.admin = decoded;
    next();

  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* ===============================
   PUBLIC ROUTES
=============================== */

app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news ORDER BY date DESC LIMIT 10'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/admission', async (req, res) => {
  try {
    const data = req.body;

    await pool.query(`
      INSERT INTO admissions 
      (student_name, father_name, mother_name, dob, gender,
       email, phone, address, previous_school,
       class_applying, blood_group, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      data.studentName,
      data.fatherName,
      data.motherName,
      data.dob,
      data.gender,
      data.email,
      data.phone,
      data.address,
      data.previousSchool,
      data.classApplying,
      data.bloodGroup
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit admission' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    await pool.query(`
      INSERT INTO contacts
      (name, email, phone, subject, message, submitted_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [name, email, phone, subject, message]);

    res.json({ success: true });

  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/* ===============================
   ADMIN NEWS ROUTES
=============================== */

app.post('/api/admin/news', adminAuth, async (req, res) => {
  const { title, content } = req.body;

  await pool.query(
    'INSERT INTO news (title, content, date) VALUES (?, ?, NOW())',
    [title, content]
  );

  res.json({ success: true });
});

app.put('/api/admin/news/:id', adminAuth, async (req, res) => {
  const { title, content } = req.body;

  await pool.query(
    'UPDATE news SET title=?, content=?, date=NOW() WHERE id=?',
    [title, content, req.params.id]
  );

  res.json({ success: true });
});

app.delete('/api/admin/news/:id', adminAuth, async (req, res) => {
  await pool.query(
    'DELETE FROM news WHERE id=?',
    [req.params.id]
  );

  res.json({ success: true });
});

/* ===============================
   SERVE FRONTEND (IMPORTANT)
=============================== */

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ===============================
   START SERVER
=============================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

