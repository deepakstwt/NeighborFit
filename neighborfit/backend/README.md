# NeighborFit Backend

Node.js backend API for the NeighborFit platform.

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation
```bash
npm install
cp env.example .env
# Edit .env with your database and email configuration
npm start
```

## Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Neighborhoods
- `GET /api/neighborhoods` - Get all neighborhoods
- `GET /api/neighborhoods/:id` - Get neighborhood by ID
- `GET /api/neighborhoods/search/:query` - Search neighborhoods
- `POST /api/neighborhoods/:id/rate` - Rate neighborhood

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/users/verify-email` - Verify email with OTP
- `POST /api/users/resend-otp` - Resend OTP

### Recommendations
- `GET /api/recommendations/personalized` - Get personalized recommendations

## Database Models
- **User**: name, email, password, preferences, favorites
- **Neighborhood**: name, city, rent, scores, amenities, location

## Scripts
- `npm start` - Start server
- `npm run dev` - Start with nodemon
- `npm run seed` - Seed database with sample data 