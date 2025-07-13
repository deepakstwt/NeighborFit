// Dynamic neighborhoods API routes handler
import clientPromise from '../../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { params } = req.query;
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('neighborfit');
    const neighborhoods = db.collection('neighborhoods');

    if (req.method === 'GET') {
      if (!params || params.length === 0) {
        return res.status(400).json({ message: 'Invalid route' });
      }

      const [firstParam, secondParam] = params;

      // Handle /neighborhoods/[id] - Get specific neighborhood
      if (firstParam && !secondParam) {
        try {
          const neighborhood = await neighborhoods.findOne({ _id: new ObjectId(firstParam) });
          if (neighborhood) {
            return res.status(200).json(neighborhood);
          } else {
            return res.status(404).json({ message: 'Neighborhood not found' });
          }
        } catch (error) {
          if (error.name === 'BSONTypeError') {
            return res.status(400).json({ message: 'Invalid neighborhood ID' });
          } else {
            throw error;
          }
        }
      }

      // Handle /neighborhoods/search/[query] - Search neighborhoods
      if (firstParam === 'search' && secondParam) {
        const query = secondParam;
        const searchResults = await neighborhoods.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { amenities: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }).sort({ safetyScore: -1 }).toArray();
        return res.status(200).json(searchResults);
      }

      // Handle /neighborhoods/city/[city] - Get neighborhoods by city
      if (firstParam === 'city' && secondParam) {
        const cityResults = await neighborhoods.find({ 
          city: { $regex: secondParam, $options: 'i' } 
        }).sort({ averageRent: 1 }).toArray();
        return res.status(200).json(cityResults);
      }

      // Handle /neighborhoods/stats/overview - Get statistics
      if (firstParam === 'stats' && secondParam === 'overview') {
        const totalNeighborhoods = await neighborhoods.countDocuments();
        const cities = await neighborhoods.distinct('city');
        const avgRent = await neighborhoods.aggregate([
          { $group: { _id: null, avgRent: { $avg: '$averageRent' } } }
        ]).toArray();
        const avgSafetyScore = await neighborhoods.aggregate([
          { $group: { _id: null, avgSafety: { $avg: '$safetyScore' } } }
        ]).toArray();
        
        const stats = {
          totalNeighborhoods,
          totalCities: cities.length,
          cities,
          averageRent: avgRent[0]?.avgRent || 0,
          averageSafetyScore: avgSafetyScore[0]?.avgSafety || 0
        };
        return res.status(200).json(stats);
      }

      return res.status(404).json({ message: 'Route not found' });
    } else if (req.method === 'POST') {
      // Handle POST requests (like rating)
      if (firstParam && secondParam === 'rate') {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        try {
          const neighborhood = await neighborhoods.findOne({ _id: new ObjectId(firstParam) });
          if (!neighborhood) {
            return res.status(404).json({ message: 'Neighborhood not found' });
          }
          
          // Add rating to neighborhood
          const existingRatingIndex = neighborhood.ratings.findIndex(
            (r) => r.user.toString() === 'anonymous' // For now, use anonymous user
          );

          if (existingRatingIndex > -1) {
            neighborhood.ratings[existingRatingIndex].rating = rating;
          } else {
            neighborhood.ratings.push({ user: 'anonymous', rating });
          }

          neighborhood.numRatings = neighborhood.ratings.length;
          neighborhood.averageRating =
            neighborhood.ratings.reduce((acc, item) => item.rating + acc, 0) / neighborhood.numRatings;

          // Update in database
          await neighborhoods.updateOne(
            { _id: new ObjectId(firstParam) },
            { 
              $set: { 
                ratings: neighborhood.ratings,
                numRatings: neighborhood.numRatings,
                averageRating: neighborhood.averageRating
              }
            }
          );

          return res.status(200).json(neighborhood);
        } catch (error) {
          if (error.name === 'BSONTypeError') {
            return res.status(400).json({ message: 'Invalid neighborhood ID' });
          } else {
            throw error;
          }
        }
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Dynamic Neighborhoods API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 