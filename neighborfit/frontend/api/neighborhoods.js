// Neighborhoods API serverless function
import clientPromise from '../lib/mongodb.js';
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
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('neighborfit');
    const neighborhoods = db.collection('neighborhoods');

    if (req.method === 'GET') {
      const { id } = req.query;
      
      // Handle specific neighborhood by ID
      if (id) {
        try {
          const neighborhood = await neighborhoods.findOne({ _id: new ObjectId(id) });
          if (neighborhood) {
            res.status(200).json(neighborhood);
          } else {
            res.status(404).json({ message: 'Neighborhood not found' });
          }
        } catch (error) {
          if (error.name === 'BSONTypeError') {
            res.status(400).json({ message: 'Invalid neighborhood ID' });
          } else {
            throw error;
          }
        }
        return;
      }
      
      // Handle filtering
      const { city, minRent, maxRent, minSafetyScore, search, amenities } = req.query;
      let filter = {};
      
      if (city) {
        filter.city = { $regex: city, $options: 'i' };
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
      
      const result = await neighborhoods.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      
      res.status(200).json(result);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Neighborhoods API Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 