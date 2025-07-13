const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/database');

// Set a default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'neighborfit-default-jwt-secret-key-2024';
}

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://neighbor-fit-ten.vercel.app',
    'https://neighborfit.vercel.app',
    'https://neighborfit-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const neighborhoodRoutes = require('./routes/api/neighborhoods');
const userRoutes = require('./routes/api/users');
const preferencesRoutes = require('./routes/api/preferences');
const chatRoutes = require('./routes/api/chat');
const recommendationRoutes = require('./routes/api/recommendations');

app.get('/', (req, res) => {
  res.json({
    message: 'NeighborFit API is running!',
    version: '1.0.0',
    endpoints: {
      neighborhoods: '/api/neighborhoods',
      users: '/api/users',
      preferences: '/api/preferences'
    },
    status: 'active'
  });
});

app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;