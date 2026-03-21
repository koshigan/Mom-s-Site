-- RSK Fashion Tailoring Database Setup for SQLite
-- Run this SQL to initialize the database

-- Designs table
CREATE TABLE IF NOT EXISTS designs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  design_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  measurements TEXT NOT NULL,
  design_id INTEGER NOT NULL,
  price REAL NOT NULL,
  order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  order_status TEXT DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Stitching', 'Ready', 'Delivered')),
  FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (username: admin, password: admin123)
-- Password is bcrypt hashed
INSERT OR IGNORE INTO admins (username, password) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample blouse designs
INSERT OR IGNORE INTO designs (design_name, image_url, price) VALUES
('Classic Silk Blouse', 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f0f?w=400', 850.00),
('Embroidered Party Blouse', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 1200.00),
('Cotton Casual Blouse', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', 650.00),
('Designer Bridal Blouse', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400', 2500.00),
('Printed Summer Blouse', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 750.00),
('Heavy Work Festive Blouse', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', 1800.00);