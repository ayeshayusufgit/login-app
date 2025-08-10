import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - update origin to your frontend Render URL
app.use(cors({
  origin: 'https://login-app-0qux.onrender.com', 
  credentials: true,
}));
app.use(express.json());

// Serve frontend static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth', authRouter);

// For all other routes, serve index.html (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
