// Recommendations API serverless function
import clientPromise from '../lib/mongodb.js';

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
      const { category } = req.query;
      
      // Handle /recommendations/personalized
      if (req.url?.includes('/personalized')) {
        const personalizedRecs = await neighborhoods.find({})
          .sort({ safetyScore: -1, lifestyleScore: -1 })
          .limit(3)
          .toArray();
        
        // Add personalized scores and reasons
        const enrichedRecs = personalizedRecs.map((neighborhood, index) => ({
          ...neighborhood,
          personalizedScore: 9.2 - (index * 0.5),
          recommendationReason: 'Perfect match for your lifestyle preferences'
        }));
        
        return res.status(200).json(enrichedRecs);
      }
      
      // Handle /recommendations/category/[category]
      if (category) {
        let categoryRecs = [];
        
        switch (category) {
          case 'trending':
            categoryRecs = await neighborhoods.find({})
              .sort({ safetyScore: -1, lifestyleScore: -1, transportScore: -1 })
              .limit(3)
              .toArray();
            
            categoryRecs = categoryRecs.map(n => ({
              ...n,
              recommendationReason: `High overall score (${((n.safetyScore + n.lifestyleScore + n.transportScore) / 3).toFixed(1)}/10)`
            }));
            break;
            
          case 'budget':
            categoryRecs = await neighborhoods.find({})
              .sort({ averageRent: 1 })
              .limit(3)
              .toArray();
            
            categoryRecs = categoryRecs.map(n => ({
              ...n,
              recommendationReason: `Best value: ₹${n.averageRent?.toLocaleString()}/month`
            }));
            break;
            
          case 'safety':
            categoryRecs = await neighborhoods.find({ safetyScore: { $gte: 7 } })
              .sort({ safetyScore: -1 })
              .limit(3)
              .toArray();
            
            categoryRecs = categoryRecs.map(n => ({
              ...n,
              recommendationReason: `Safety score: ${n.safetyScore}/10`
            }));
            break;
            
          default:
            categoryRecs = await neighborhoods.find({})
              .sort({ safetyScore: -1 })
              .limit(3)
              .toArray();
        }
        
        return res.status(200).json(categoryRecs);
      }
      
      // Default personalized recommendations
      const defaultRecs = await neighborhoods.find({})
        .sort({ safetyScore: -1, lifestyleScore: -1 })
        .limit(3)
        .toArray();
      
      const enrichedDefaultRecs = defaultRecs.map((neighborhood, index) => ({
        ...neighborhood,
        personalizedScore: 9.2 - (index * 0.5),
        recommendationReason: 'Perfect match for your lifestyle preferences'
      }));
      
      return res.status(200).json(enrichedDefaultRecs);
    }
    
    if (req.method === 'POST') {
      // Handle /recommendations/interaction
      if (req.url?.includes('/interaction')) {
        const { neighborhoodId, interactionType, metadata } = req.body;
        
        // Mock interaction tracking
        return res.status(200).json({
          success: true,
          message: 'Interaction tracked successfully',
          neighborhoodId,
          interactionType,
          metadata
        });
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Recommendations API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 