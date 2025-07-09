const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Set a default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'neighborfit-default-jwt-secret-key-2024';
}

const app = express();

app.use(cors());
app.use(express.json());

const neighborhoodRoutes = require('./routes/neighborhoods');
const userRoutes = require('./routes/users');
const preferencesRoutes = require('./routes/preferences');

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

console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  dbName: 'test',
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
  })
  .catch((error) => {
    console.error('MongoDB connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 