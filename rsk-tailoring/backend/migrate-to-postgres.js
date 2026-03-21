// migrate-to-postgres.js
// Run this script to migrate from SQLite to PostgreSQL
// Usage: node migrate-to-postgres.js

const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');

async function migrateDatabase() {
  // SQLite connection
  const sqliteDb = new sqlite3.Database('./rsk_tailoring.db');

  // PostgreSQL connection (update with your connection string)
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/rsk_tailoring',
  });

  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    // Create tables in PostgreSQL
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS designs (
        id SERIAL PRIMARY KEY,
        design_name TEXT NOT NULL,
        image_url TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        measurements TEXT NOT NULL,
        design_id INTEGER NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
        price DECIMAL(10, 2) NOT NULL,
        order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        order_status TEXT DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Stitching', 'Ready', 'Delivered'))
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrate data
    console.log('Migrating designs...');
    const designs = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM designs', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const design of designs) {
      await pgClient.query(
        'INSERT INTO designs (id, design_name, image_url, price, created_at) VALUES ($1, $2, $3, $4, $5)',
        [design.id, design.design_name, design.image_url, design.price, design.created_at]
      );
    }

    console.log('Migrating admins...');
    const admins = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM admins', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const admin of admins) {
      await pgClient.query(
        'INSERT INTO admins (id, username, password, created_at) VALUES ($1, $2, $3, $4)',
        [admin.id, admin.username, admin.password, admin.created_at]
      );
    }

    console.log('Migrating orders...');
    const orders = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM orders', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const order of orders) {
      await pgClient.query(
        'INSERT INTO orders (id, customer_name, phone, measurements, design_id, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [order.id, order.customer_name, order.phone, order.measurements, order.design_id, order.price, order.order_time, order.order_status]
      );
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

migrateDatabase();