// backend/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import db from './db.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-deployed-frontend.com' // Change this to your actual frontend URL
  ],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);

app.get('/health', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT NOW() AS now');
    res.status(200).json({ status: 'ok', time: rows[0].now });
  } catch (err) {
    console.error('DB Health Check Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Serve frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please free the port or use a different one.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});