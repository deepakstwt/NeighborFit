// Neighborhoods API serverless function
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
    // Enhanced mock data with more neighborhoods
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
        location: { coordinates: [72.8777, 19.0760] },
        averageRating: 4.5,
        numRatings: 120
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
        location: { coordinates: [77.6117, 12.9352] },
        averageRating: 4.2,
        numRatings: 85
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
        location: { coordinates: [77.2090, 28.6315] },
        averageRating: 4.0,
        numRatings: 95
      },
      {
        _id: '4',
        name: 'Hitech City',
        city: 'Hyderabad',
        description: 'Major IT corridor with modern infrastructure',
        averageRent: 35000,
        safetyScore: 8.0,
        lifestyleScore: 7.5,
        transportScore: 7.5,
        amenities: ['IT Parks', 'Metro Access', 'Shopping Malls', 'Restaurants'],
        imageUrl: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&h=400&fit=crop',
        location: { coordinates: [78.3817, 17.4498] },
        averageRating: 4.3,
        numRatings: 67
      },
      {
        _id: '5',
        name: 'T. Nagar',
        city: 'Chennai',
        description: 'Shopping paradise with traditional South Indian culture',
        averageRent: 40000,
        safetyScore: 7.5,
        lifestyleScore: 8.0,
        transportScore: 8.5,
        amenities: ['Shopping', 'Temples', 'Restaurants', 'Markets'],
        imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop',
        location: { coordinates: [80.2340, 13.0418] },
        averageRating: 4.1,
        numRatings: 78
      }
    ];

    if (req.method === 'GET') {
      const { id } = req.query;
      
      // Handle specific neighborhood by ID
      if (id) {
        const neighborhood = mockNeighborhoods.find(n => n._id === id);
        if (neighborhood) {
          res.status(200).json(neighborhood);
        } else {
          res.status(404).json({ message: 'Neighborhood not found' });
        }
        return;
      }
      
      // Handle filtering
      const { city, minRent, maxRent, minSafetyScore, search } = req.query;
      let filteredNeighborhoods = [...mockNeighborhoods];
      
      if (city) {
        filteredNeighborhoods = filteredNeighborhoods.filter(n => 
          n.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      if (minRent) {
        filteredNeighborhoods = filteredNeighborhoods.filter(n => 
          n.averageRent >= parseInt(minRent)
        );
      }
      
      if (maxRent) {
        filteredNeighborhoods = filteredNeighborhoods.filter(n => 
          n.averageRent <= parseInt(maxRent)
        );
      }
      
      if (minSafetyScore) {
        filteredNeighborhoods = filteredNeighborhoods.filter(n => 
          n.safetyScore >= parseFloat(minSafetyScore)
        );
      }
      
      if (search) {
        filteredNeighborhoods = filteredNeighborhoods.filter(n => 
          n.name.toLowerCase().includes(search.toLowerCase()) ||
          n.city.toLowerCase().includes(search.toLowerCase()) ||
          n.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      res.status(200).json(filteredNeighborhoods);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Neighborhoods API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 