import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'Invalid email format' });

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0)
      return res.status(400).json({ error: 'User already exists' });

    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;