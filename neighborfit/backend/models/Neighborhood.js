const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  averageRent: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  safetyScore: {
    type: Number,
    min: 0,
    max: 10
  },
  lifestyleScore: {
    type: Number,
    min: 0,
    max: 10
  },
  transportScore: {
    type: Number,
    min: 0,
    max: 10
  },
  imageUrl: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  population: {
    type: String,
    trim: true
  },
  avgCommuteTime: {
    type: String,
    trim: true
  },
  nearbyLandmarks: [{
    type: String,
    trim: true
  }],
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
  ],
  numRatings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true
});

neighborhoodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Neighborhood', neighborhoodSchema); 