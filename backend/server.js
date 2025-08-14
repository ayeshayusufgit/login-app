import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to check admin role
const swaggerJWTAuth = (req, res, next) => {
  if (process.env.ENV !== 'prod') {
    return next(); // no auth in dev
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.use('/api-docs', swaggerJWTAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Swagger setup ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login/Register API',
      version: '1.0.0',
      description: 'API documentation for the Login/Register app',
    },
    servers: [
      {
        url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- End Swagger setup ---

// Serve config.js dynamically from .env
app.get('/config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.BACKEND_URL = "${process.env.BACKEND_URL}";`);
});

// Middleware
app.use(cors({
  origin: true, // or set to your frontend URL
  credentials: true,
}));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth', authRouter);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📄 Swagger docs available at /api-docs`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
