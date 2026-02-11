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

/* ===============================
   INITIAL SETUP (AUTO CREATE TABLES + ADMIN)
=============================== */
async function initializeDatabase() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");

    // Create admins table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create news table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admissions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        dob DATE,
        gender VARCHAR(50),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        previous_school VARCHAR(255),
        class_applying VARCHAR(100),
        blood_group VARCHAR(20),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contacts table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        subject VARCHAR(500),
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin if not exists
    const [admins] = await conn.query(
      "SELECT * FROM admins WHERE email = ?",
      ["admin@sainik.com"]
    );

    if (!admins.length) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await conn.query(
        "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
        ["admin@sainik.com", hashedPassword, "Administrator"]
      );

      console.log("✅ Default Admin Created");
      console.log("📧 Email: admin@sainik.com");
      console.log("🔑 Password: Admin@123");
    }

    conn.release();
    console.log("✅ Tables Checked/Created");

  } catch (err) {
    console.error("❌ DB Init Error:", err.message);
  }
}

initializeDatabase();

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

  } catch {
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
   SERVE FRONTEND
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


