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
app.use(cors());
app.use(express.json());

// Routes
const neighborhoodRoutes = require('./routes/api/neighborhoods');
const userRoutes = require('./routes/api/users');
const preferencesRoutes = require('./routes/api/preferences');

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;