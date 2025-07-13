// Dynamic neighborhoods API routes handler
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
    
    // Mock data (same as in neighborhoods.js)
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
      if (!params || params.length === 0) {
        return res.status(400).json({ message: 'Invalid route' });
      }

      const [firstParam, secondParam] = params;

      // Handle /neighborhoods/[id] - Get specific neighborhood
      if (firstParam && !secondParam) {
        const neighborhood = mockNeighborhoods.find(n => n._id === firstParam);
        if (neighborhood) {
          return res.status(200).json(neighborhood);
        } else {
          return res.status(404).json({ message: 'Neighborhood not found' });
        }
      }

      // Handle /neighborhoods/search/[query] - Search neighborhoods
      if (firstParam === 'search' && secondParam) {
        const query = secondParam.toLowerCase();
        const searchResults = mockNeighborhoods.filter(n => 
          n.name.toLowerCase().includes(query) ||
          n.city.toLowerCase().includes(query) ||
          n.description.toLowerCase().includes(query) ||
          n.amenities.some(amenity => amenity.toLowerCase().includes(query))
        );
        return res.status(200).json(searchResults);
      }

      // Handle /neighborhoods/city/[city] - Get neighborhoods by city
      if (firstParam === 'city' && secondParam) {
        const city = secondParam.toLowerCase();
        const cityResults = mockNeighborhoods.filter(n => 
          n.city.toLowerCase().includes(city)
        );
        return res.status(200).json(cityResults);
      }

      // Handle /neighborhoods/stats/overview - Get statistics
      if (firstParam === 'stats' && secondParam === 'overview') {
        const stats = {
          totalNeighborhoods: mockNeighborhoods.length,
          totalCities: [...new Set(mockNeighborhoods.map(n => n.city))].length,
          cities: [...new Set(mockNeighborhoods.map(n => n.city))],
          averageRent: mockNeighborhoods.reduce((sum, n) => sum + n.averageRent, 0) / mockNeighborhoods.length,
          averageSafetyScore: mockNeighborhoods.reduce((sum, n) => sum + n.safetyScore, 0) / mockNeighborhoods.length
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
        
        const neighborhood = mockNeighborhoods.find(n => n._id === firstParam);
        if (!neighborhood) {
          return res.status(404).json({ message: 'Neighborhood not found' });
        }
        
        // Mock rating update
        return res.status(200).json({
          ...neighborhood,
          averageRating: ((neighborhood.averageRating * neighborhood.numRatings) + rating) / (neighborhood.numRatings + 1),
          numRatings: neighborhood.numRatings + 1
        });
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Dynamic Neighborhoods API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 