require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

// Test DB + Auto Create Tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected");

    // Create tables automatically
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        dob DATE,
        gender VARCHAR(20),
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        previous_school VARCHAR(255),
        class_applying VARCHAR(50),
        blood_group VARCHAR(10),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        subject VARCHAR(500),
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin if not exists
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await connection.query(`
      INSERT IGNORE INTO admins (email, password, name)
      VALUES ('admin@sainik.com', ?, 'Administrator')
    `, [hashedPassword]);

    connection.release();
    console.log("✅ Tables Checked/Created");

  } catch (err) {
    console.error("❌ MySQL Initialization Error:", err.message);
  }
}

initDatabase();

// ================= ROUTES =================

app.get('/', (req, res) => {
  res.send("Sainik Defense College Backend Running");
});

app.get('/news', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM news ORDER BY date DESC LIMIT 10");
    res.json(rows);
  } catch (err) {
    console.error("Get news error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
