const path = require('path');

// Production database (PostgreSQL)
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL) {
  const { Client } = require('pg');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  client.connect();

  const promiseDb = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        client.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve([result.rows]); // Mimic mysql2 format
          }
        });
      });
    }
  };

  module.exports = promiseDb;
} else {
  // Development database (SQLite)
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.join(__dirname, 'rsk_tailoring.db');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });

  const promiseDb = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        const sqlUpper = sql.trim().toUpperCase();
        if (sqlUpper.startsWith('SELECT') || sqlUpper.startsWith('PRAGMA')) {
          db.all(sql, params, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve([rows]); // Mimic mysql2 format
            }
          });
        } else {
          db.run(sql, params, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve([{ insertId: this.lastID, affectedRows: this.changes }]); // Mimic mysql2 format
            }
          });
        }
      });
    }
  };

  module.exports = promiseDb;
}
