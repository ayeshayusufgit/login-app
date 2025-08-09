// backend/routes/auth.js
import express from 'express';
import db from '../db.js';
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword
} from '../auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be 6-20 chars, include letters and numbers' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await hashPassword(password);
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
    return res.status(200).json({ message: 'Registration successful' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const user = users[0];
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;