import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// ------------------- ✅ CORS Configuration (Dynamic for Vercel) -------------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173'
];

// Custom middleware to handle CORS dynamically
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // ✅ Allow localhost + any Vercel deployment for your project
  const vercelPattern = /^https:\/\/task-management-system-[a-z0-9-]+\.vercel\.app$/;

  if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Apply CORS globally for Express
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^https:\/\/task-management-system-[a-z0-9-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// -------------------------------------------------------------------------------

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test CORS route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log('🌍 CORS dynamically enabled for:');
  console.log('- http://localhost:3000');
  console.log('- http://localhost:5173');
  console.log('- All Vercel deployments under https://task-management-system-*.vercel.app');
});
