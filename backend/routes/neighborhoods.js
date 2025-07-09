const express = require('express');
const Neighborhood = require('../models/Neighborhood');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { city, minRent, maxRent, minSafetyScore, amenities, search } = req.query;
    
    let filter = {};
    
    if (city) {
      filter.city = city;
    }
    
    if (minRent || maxRent) {
      filter.averageRent = {};
      if (minRent) filter.averageRent.$gte = parseInt(minRent);
      if (maxRent) filter.averageRent.$lte = parseInt(maxRent);
    }
    
    if (minSafetyScore) {
      filter.safetyScore = { $gte: parseFloat(minSafetyScore) };
    }
    
    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenityArray };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const neighborhoods = await Neighborhood.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(neighborhoods);
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    res.status(500).json({ message: 'Error fetching neighborhoods', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);
    
    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found' });
    }
    
    res.json(neighborhood);
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid neighborhood ID' });
    }
    res.status(500).json({ message: 'Error fetching neighborhood', error: error.message });
  }
});

router.get('/city/:city', async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.find({ 
      city: { $regex: req.params.city, $options: 'i' } 
    }).sort({ averageRent: 1 });
    
    res.json(neighborhoods);
  } catch (error) {
    console.error('Error fetching neighborhoods by city:', error);
    res.status(500).json({ message: 'Error fetching neighborhoods by city', error: error.message });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const neighborhoods = await Neighborhood.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { amenities: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ safetyScore: -1 });
    
    res.json(neighborhoods);
  } catch (error) {
    console.error('Error searching neighborhoods:', error);
    res.status(500).json({ message: 'Error searching neighborhoods', error: error.message });
  }
});

router.get('/stats/overview', async (req, res) => {
  try {
    const totalNeighborhoods = await Neighborhood.countDocuments();
    const cities = await Neighborhood.distinct('city');
    const avgRent = await Neighborhood.aggregate([
      { $group: { _id: null, avgRent: { $avg: '$averageRent' } } }
    ]);
    const avgSafetyScore = await Neighborhood.aggregate([
      { $group: { _id: null, avgSafety: { $avg: '$safetyScore' } } }
    ]);
    
    res.json({
      totalNeighborhoods,
      totalCities: cities.length,
      cities,
      averageRent: avgRent[0]?.avgRent || 0,
      averageSafetyScore: avgSafetyScore[0]?.avgSafety || 0
    });
  } catch (error) {
    console.error('Error fetching neighborhood statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const { userId } = req.user;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const neighborhood = await Neighborhood.findById(req.params.id);

    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found.' });
    }

    const existingRatingIndex = neighborhood.ratings.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingRatingIndex > -1) {
      neighborhood.ratings[existingRatingIndex].rating = rating;
    } else {
      neighborhood.ratings.push({ user: userId, rating });
    }

    neighborhood.numRatings = neighborhood.ratings.length;
    neighborhood.averageRating =
      neighborhood.ratings.reduce((acc, item) => item.rating + acc, 0) / neighborhood.numRatings;

    const updatedNeighborhood = await neighborhood.save();

    res.json(updatedNeighborhood);
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ message: 'Failed to submit rating.', error: error.message });
  }
});

module.exports = router;