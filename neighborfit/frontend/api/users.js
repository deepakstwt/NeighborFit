// Users API serverless function
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
    // Handle different user endpoints
    if (req.method === 'POST') {
      // For now, return mock responses
      // You would replace this with your actual authentication logic
      
      if (req.url?.includes('/login')) {
        res.status(200).json({
          token: 'mock-jwt-token',
          user: {
            id: 'user123',
            email: 'test@example.com',
            name: 'Test User',
            isEmailVerified: true,
            favoriteNeighborhoods: []
          }
        });
      } else if (req.url?.includes('/register')) {
        res.status(200).json({
          message: 'Registration successful! Please verify your email to continue.',
          requiresEmailVerification: true,
          email: req.body.email
        });
      } else {
        res.status(404).json({ message: 'Endpoint not found' });
      }
    } else if (req.method === 'GET') {
      // Handle GET requests
      res.status(200).json({ message: 'Users API is working' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 