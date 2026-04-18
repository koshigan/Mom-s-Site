// ✅ Load .env ONLY for local development
if (!process.env.RAILWAY_ENVIRONMENT) {
  require('dotenv').config();
}

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const path = require('path');

// ===============================
// ✅ PRIORITY 1: Railway MySQL
// ===============================
if (process.env.RAILWAY_ENVIRONMENT) {
  console.log("👉 Running on Railway → Using MySQL");

  const mysql = require('mysql2/promise');

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // ✅ TEST CONNECTION (INSIDE BLOCK)
  pool.getConnection()
    .then(conn => {
      console.log("✅ Connected to MySQL");
      conn.release();
    })
    .catch(err => {
      console.error("❌ MySQL connection failed:", err);
    });

  module.exports = {
    query: (sql, params = []) => pool.query(sql, params),
  };
}

// ===============================
// ✅ PRIORITY 2: Local MySQL
// ===============================
else if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  console.log("👉 Using Local MySQL");

  const mysql = require('mysql2/promise');

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  module.exports = {
    query: (sql, params = []) => pool.query(sql, params),
  };
}

// ===============================
// ✅ PRIORITY 3: SQLite fallback
// ===============================
else {
  console.log("👉 Using SQLite Database");

  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.join(__dirname, 'rsk_tailoring.db');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });

  module.exports = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        const sqlUpper = sql.trim().toUpperCase();

        if (sqlUpper.startsWith('SELECT') || sqlUpper.startsWith('PRAGMA')) {
          db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve([rows]);
          });
        } else {
          db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          });
        }
      });
    }
  };
}