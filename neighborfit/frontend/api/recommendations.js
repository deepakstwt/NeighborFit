// Recommendations API serverless function
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
    // Mock neighborhoods data for recommendations
    const mockNeighborhoods = [
      {
        _id: '1',
        name: 'Bandra West',
        city: 'Mumbai',
        description: 'Trendy neighborhood with great restaurants and nightlife',
        averageRent: 85000,
        safetyScore: 8.5,
        lifestyleScore: 9.0,
        transportScore: 8.0,
        amenities: ['Metro Access', 'Restaurants', 'Shopping Malls', 'Beach Access'],
        imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
        personalizedScore: 9.2,
        recommendationReason: 'Perfect match for your lifestyle preferences'
      },
      {
        _id: '2',
        name: 'Koramangala',
        city: 'Bangalore',
        description: 'IT hub with modern amenities and startup culture',
        averageRent: 45000,
        safetyScore: 7.5,
        lifestyleScore: 8.5,
        transportScore: 7.0,
        amenities: ['IT Parks', 'Restaurants', 'Metro Access', 'Cafes'],
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
        personalizedScore: 8.7,
        recommendationReason: 'Great for tech professionals'
      },
      {
        _id: '3',
        name: 'Connaught Place',
        city: 'Delhi',
        description: 'Central business district with heritage architecture',
        averageRent: 75000,
        safetyScore: 7.0,
        lifestyleScore: 8.0,
        transportScore: 9.0,
        amenities: ['Metro Access', 'Shopping', 'Restaurants', 'Offices'],
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=400&fit=crop',
        personalizedScore: 8.3,
        recommendationReason: 'Excellent connectivity and business opportunities'
      }
    ];

    if (req.method === 'GET') {
      const { category } = req.query;
      
      // Handle /recommendations/personalized
      if (req.url?.includes('/personalized')) {
        const personalizedRecs = mockNeighborhoods
          .sort((a, b) => b.personalizedScore - a.personalizedScore)
          .slice(0, 3);
        return res.status(200).json(personalizedRecs);
      }
      
      // Handle /recommendations/category/[category]
      if (category) {
        let categoryRecs = [...mockNeighborhoods];
        
        switch (category) {
          case 'trending':
            categoryRecs = categoryRecs
              .sort((a, b) => ((b.safetyScore + b.lifestyleScore + b.transportScore) / 3) - 
                             ((a.safetyScore + a.lifestyleScore + a.transportScore) / 3))
              .slice(0, 3);
            break;
          case 'budget':
            categoryRecs = categoryRecs
              .sort((a, b) => a.averageRent - b.averageRent)
              .slice(0, 3);
            break;
          case 'safety':
            categoryRecs = categoryRecs
              .filter(n => n.safetyScore >= 7)
              .sort((a, b) => b.safetyScore - a.safetyScore)
              .slice(0, 3);
            break;
          default:
            categoryRecs = categoryRecs.slice(0, 3);
        }
        
        return res.status(200).json(categoryRecs);
      }
      
      // Default personalized recommendations
      const defaultRecs = mockNeighborhoods
        .sort((a, b) => b.personalizedScore - a.personalizedScore)
        .slice(0, 3);
      return res.status(200).json(defaultRecs);
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