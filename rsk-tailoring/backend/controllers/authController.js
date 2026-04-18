const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // ✅ Find admin
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = rows[0];

    let isMatch = false;

    // ✅ FIX: handle broken hash OR plain password
    if (admin.password.startsWith('$2')) {
      // bcrypt hash exists
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      // fallback (plain password case)
      isMatch = password === admin.password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET || 'secret123',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (err) {
    console.error('❌ LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { login };