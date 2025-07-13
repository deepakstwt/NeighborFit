# Vercel Deployment Guide - Fix for Neighborhood API Issues

## The Problem
Your neighborhoods weren't being fetched in Vercel because:
1. The API was configured to use `http://localhost:5001/api` in production
2. No environment variable was set for the production API URL
3. The backend was not deployed or accessible from Vercel

## The Solution
I've created **serverless API functions** that work within your Vercel deployment. Here's what was implemented:

### 1. API Configuration Update
- Updated `src/lib/api.js` to use `/api` in production
- Falls back to localhost in development

### 2. Serverless API Functions Created
- `api/neighborhoods.js` - Main neighborhoods endpoint
- `api/neighborhoods/[...params].js` - Dynamic routes (search, by ID, etc.)
- `api/users.js` - User authentication endpoints
- `api/recommendations.js` - Recommendations API

### 3. Vercel Configuration
- Updated `vercel.json` to handle API routes properly

## How It Works

### API Endpoints Available:
- `GET /api/neighborhoods` - Get all neighborhoods
- `GET /api/neighborhoods/1` - Get specific neighborhood
- `GET /api/neighborhoods/search/mumbai` - Search neighborhoods
- `GET /api/neighborhoods/city/mumbai` - Get by city
- `GET /api/neighborhoods/stats/overview` - Get statistics
- `POST /api/neighborhoods/1/rate` - Rate neighborhood
- `GET /api/recommendations/personalized` - Get recommendations
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Sample Data Included:
- 5 neighborhoods across major Indian cities
- Complete with safety scores, amenities, images
- Proper filtering and search functionality

## Deployment Steps

### Option 1: Use Serverless Functions (Recommended)
1. **Deploy to Vercel**: Push your changes and the API will work automatically
2. **No additional setup needed**: The serverless functions are included

### Option 2: Use External Backend
1. **Deploy backend separately** (Heroku, Railway, etc.)
2. **Set environment variable in Vercel**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
3. **Redeploy frontend**

## Testing the API

Once deployed, you can test the API:

```bash
# Test neighborhoods endpoint
curl https://your-vercel-app.vercel.app/api/neighborhoods

# Test specific neighborhood
curl https://your-vercel-app.vercel.app/api/neighborhoods/1

# Test search
curl https://your-vercel-app.vercel.app/api/neighborhoods/search/mumbai
```

## Converting to Real Database

To use a real database instead of mock data:

1. **Install MongoDB dependencies**:
```bash
npm install mongodb
```

2. **Add environment variables** in Vercel:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your JWT secret

3. **Update serverless functions** to use real database queries instead of mock data

## Benefits of This Approach

1. **No separate backend deployment needed**
2. **Works seamlessly with Vercel**
3. **Automatic scaling**
4. **Easy to maintain**
5. **Mock data for immediate functionality**

## File Structure

```
neighborfit/frontend/
├── api/
│   ├── neighborhoods.js
│   ├── neighborhoods/
│   │   └── [...params].js
│   ├── users.js
│   └── recommendations.js
├── src/
│   └── lib/
│       └── api.js (updated)
└── vercel.json (updated)
```

## Next Steps

1. **Deploy to Vercel** - Push changes and test
2. **Verify API endpoints** work in production
3. **Optional**: Replace mock data with real database
4. **Optional**: Add authentication middleware
5. **Optional**: Add rate limiting

Your neighborhoods should now load properly in Vercel! 🎉 