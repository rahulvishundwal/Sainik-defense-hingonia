-- Sainik Defense College - Fresh Database Schema
-- Run this in your Aiven MySQL database

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255) NOT NULL,
  mother_name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  previous_school VARCHAR(255),
  class_applying VARCHAR(50) NOT NULL,
  blood_group VARCHAR(10),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin
-- Email: admin@sainik.com
-- Password: admin123
INSERT INTO admins (email, password, name) VALUES 
('admin@sainik.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1XbRwu0wHw8vGF0dQhWQmJKLHGHqJq2', 'Administrator')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample news
INSERT INTO news (title, content, date) VALUES 
('Admissions Open 2026-27', 'We are pleased to announce that admissions for the academic year 2026-27 are now open. Visit our office or fill the online admission form.', NOW()),
('Annual Sports Day', 'Annual Sports Day will be celebrated on March 20, 2026. All students must participate in at least one event.', NOW()),
('Parent-Teacher Meeting', 'Parent-Teacher meeting is scheduled for February 25, 2026 from 9 AM to 1 PM.', NOW())
ON DUPLICATE KEY UPDATE title=title;

-- Verify tables
SHOW TABLES;

-- Show sample data
SELECT 'Admins:' as table_name;
SELECT id, email, name FROM admins;

SELECT 'News:' as table_name;
SELECT id, title, LEFT(content, 50) as content_preview FROM news;
