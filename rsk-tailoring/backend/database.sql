-- RSK Fashion Tailoring Database Setup
-- Run this SQL file in your MySQL server to initialize the database

CREATE DATABASE IF NOT EXISTS rsk_tailoring;
USE rsk_tailoring;

-- Designs table
CREATE TABLE IF NOT EXISTS designs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  design_name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  measurements TEXT NOT NULL,
  design_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_status ENUM('Pending', 'Stitching', 'Ready', 'Delivered') DEFAULT 'Pending',
  FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (username: admin, password: admin123)
-- Password is bcrypt hashed
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample blouse designs
INSERT INTO designs (design_name, image_url, price) VALUES
('Classic Silk Blouse', 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f0f?w=400', 850.00),
('Embroidered Party Blouse', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 1200.00),
('Cotton Casual Blouse', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', 650.00),
('Designer Bridal Blouse', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400', 2500.00),
('Printed Summer Blouse', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 750.00),
('Heavy Work Festive Blouse', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', 1800.00)
ON DUPLICATE KEY UPDATE design_name = design_name;