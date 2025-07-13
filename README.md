# 🏘️ NeighborFit

Smart neighborhood recommendation platform that helps you find the perfect place to live.

## Features

- 🏠 **Smart Recommendations** - AI-powered neighborhood suggestions
- 🔍 **Advanced Search** - Filter by budget, amenities, location
- 📱 **Responsive Design** - Works on all devices
- 🤖 **AI Assistant** - Get personalized help and suggestions
- 👤 **User Profiles** - Save preferences and favorites
- 🔐 **Secure Authentication** - OTP-based email verification

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/deepakstwt/NeighborFit.git
cd NeighborFit

# Setup backend
cd neighborfit/backend
npm install
cp env.example .env
# Edit .env with your configuration
npm start

# Setup frontend (in new terminal)
cd ../frontend
npm install
npm start
```

### Environment Variables

Backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Project Structure

```
neighborfit/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── config/      # Configuration
│   └── server.js
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/         # API services
│   │   ├── context/     # React Context
│   │   └── pages/       # Static pages
│   └── public/
└── api/                 # Vercel serverless functions
```

## API Endpoints

- `GET /api/neighborhoods` - Get all neighborhoods
- `GET /api/neighborhoods/:id` - Get neighborhood details
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/recommendations/personalized` - Get recommendations

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Local Development
```bash
# Start backend
cd neighborfit/backend && npm start

# Start frontend
cd neighborfit/frontend && npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
