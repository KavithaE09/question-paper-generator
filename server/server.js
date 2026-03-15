const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ FIX: Cross-Origin-Opener-Policy for Google Sign-In popup
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const departmentRoutes = require('./routes/departments');
const courseRoutes = require('./routes/courses');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174','http://localhost:5175', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Question Paper API Server Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});