const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters.']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  preferences: {
    budget: {
      min: { type: Number, default: 15000 },
      max: { type: Number, default: 50000 }
    },
    preferredCities: [{
      type: String,
      trim: true
    }],
    lifestylePreferences: [{
      type: String,
      enum: ['Family Friendly', 'Young Professionals', 'Students', 'Retirees', 'Expatriates', 'Artists', 'Tech Professionals', 'Business Executives'],
      trim: true
    }],
    amenityPreferences: [{
      type: String,
      enum: ['Metro Access', 'Schools', 'Hospitals', 'Shopping Malls', 'Restaurants', 'Fine Dining', 'Parks', 'Gyms', 'IT Parks', 'Airport Access', 'Sea View', 'Lake View', 'Golf Course', 'Coworking Spaces', 'Art Galleries', 'Trendy Cafes', 'Shopping Streets', 'Luxury Hotels', 'International Schools', 'Corporate Offices', 'Colleges', 'Excellent Schools', 'Shopping Centers'],
      trim: true
    }],
    familySize: {
      type: String,
      enum: ['Single', 'Couple', 'Small Family (1-2 kids)', 'Large Family (3+ kids)', 'Roommates'],
      default: 'Single'
    },
    commutePreference: {
      type: String,
      enum: ['Walking Distance', 'Short Commute (<30 min)', 'Medium Commute (30-60 min)', 'Long Commute (>60 min)'],
      default: 'Short Commute (<30 min)'
    },
    
    workStyle: {
      type: String,
      enum: ['remote', 'hybrid', 'office', 'freelance'],
      default: 'remote'
    },
    familyStatus: {
      type: String,
      enum: ['single', 'couple', 'nuclear-family', 'joint-family', 'roommates', 'bachelor'],
      default: 'single'
    },
    lifestyle: {
      type: String,
      enum: ['traditional', 'modern', 'cultural', 'spiritual', 'active', 'social', 'quiet'],
      default: 'traditional'
    },
    priceRange: {
      type: [Number],
      default: [10000, 50000],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length === 2 && v[0] <= v[1];
        },
        message: 'priceRange must be an array of two numbers [min, max] where min <= max'
      }
    },
    amenities: [{
      type: String,
      trim: true
    }],
    neighborhoodSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    safetyImportance: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    nightlifeImportance: {
      type: Number,
      min: 1,
      max: 10,
      default: 3
    },
    greenSpaceImportance: {
      type: Number,
      min: 1,
      max: 10,
      default: 4
    },
    schoolQualityImportance: {
      type: Number,
      min: 1,
      max: 10,
      default: 3
    },
    publicTransportImportance: {
      type: Number,
      min: 1,
      max: 10,
      default: 4
    }
  },
  favoriteNeighborhoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Neighborhood'
  }],
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String
  },
  emailVerificationOTPExpires: {
    type: Date
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 