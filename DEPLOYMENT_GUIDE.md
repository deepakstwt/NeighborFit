# 🚀 Complete NeighborFit Deployment Guide

## 📋 Prerequisites

- [x] Project running locally ✅
- [x] MongoDB database connected ✅
- [x] Git repository setup ✅
- [ ] Vercel account (free)
- [ ] Domain name (optional)

## 🎯 **Option 1: Single Vercel Deployment (Recommended)**

Deploy everything to Vercel using serverless functions - no separate backend needed!

### Step 1: Prepare for Deployment

```bash
# Ensure you're in the project root
cd /Users/deepakprajapati/Desktop/SDE\ PROJECT

# Make sure all changes are committed
git add .
git commit -m "🚀 Prepare for deployment"
git push origin main
```

### Step 2: Connect to Real Database (For Production)

Update the serverless functions to use real MongoDB instead of mock data:

1. **Get your MongoDB connection string** from your current `.env` file
2. **Create environment variables in Vercel Dashboard**:
   - `MONGODB_URI` = `mongodb+srv://your-connection-string`
   - `JWT_SECRET` = `your-jwt-secret-key`

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository**: `deepakstwt/NeighborFit`
4. **Configure the project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `neighborfit/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Add Environment Variables**:
   - `REACT_APP_API_URL` = `/api`
   - `MONGODB_URI` = `mongodb+srv://your-connection-string`
   - `JWT_SECRET` = `your-jwt-secret-key`
6. **Click "Deploy"**

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd neighborfit/frontend

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "frontend"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? neighborfit
# ? In which directory is your code located? ./
```

### Step 4: Configure Production Database

Update your serverless functions to connect to MongoDB:

```bash
# Install MongoDB in frontend directory
cd neighborfit/frontend
npm install mongodb
```

### Step 5: Test Production Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app/api/neighborhoods`
- `https://your-app.vercel.app/api/neighborhoods/search/mumbai`
- `https://your-app.vercel.app/` (main app)

---

## 🔧 **Option 2: Separate Backend Deployment**

Deploy frontend and backend separately for maximum control.

### Deploy Backend (Choose One):

#### A. Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)** and sign up
2. **Click "New Project"** → **Deploy from GitHub repo**
3. **Select your repository** and choose `neighborfit/backend` folder
4. **Add Environment Variables**:
   - `MONGODB_URI` = `mongodb+srv://your-connection-string`
   - `JWT_SECRET` = `your-jwt-secret-key`
   - `PORT` = `5001`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app`
5. **Deploy** - Railway will give you a URL like `https://your-app.railway.app`

#### B. Deploy Backend to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
cd neighborfit/backend
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://your-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set CLIENT_URL="https://your-frontend-domain.vercel.app"

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

1. **Update API URL**: Set `REACT_APP_API_URL` in Vercel to your backend URL
2. **Deploy frontend** following Option 1 steps above

---

## 🔐 **Security Configuration**

### Environment Variables Needed:

**For Production Database:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neighborfit
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For Frontend:**
```env
REACT_APP_API_URL=/api  # For Option 1
# OR
REACT_APP_API_URL=https://your-backend.railway.app/api  # For Option 2
```

---

## 📈 **Post-Deployment Checklist**

### Test Core Features:
- [ ] Homepage loads correctly
- [ ] Dashboard shows neighborhoods
- [ ] Explore page displays all neighborhoods
- [ ] Search functionality works
- [ ] Filtering by city/rent/safety works
- [ ] Neighborhood details page loads
- [ ] User registration/login works
- [ ] Favorites functionality works
- [ ] AI recommendations display
- [ ] Mobile responsiveness

### Test API Endpoints:
- [ ] `GET /api/neighborhoods` - Returns all neighborhoods
- [ ] `GET /api/neighborhoods/search/mumbai` - Search works
- [ ] `GET /api/neighborhoods/1` - Individual neighborhood
- [ ] `POST /api/users/register` - User registration
- [ ] `POST /api/users/login` - User login

---

## 🛠️ **Troubleshooting Common Issues**

### Issue: "API not found" in production
**Solution**: Verify `REACT_APP_API_URL` is set correctly in Vercel environment variables

### Issue: "Database connection failed"
**Solution**: Check `MONGODB_URI` in environment variables, ensure IP whitelist includes 0.0.0.0/0

### Issue: "CORS errors"
**Solution**: Update backend CORS configuration to include your Vercel domain

### Issue: "Build fails"
**Solution**: Check build logs in Vercel dashboard, ensure all dependencies are in package.json

---

## 🎯 **Recommended Approach**

**I recommend Option 1 (Single Vercel Deployment)** because:
- ✅ Simpler setup and maintenance
- ✅ Built-in serverless functions
- ✅ Automatic scaling
- ✅ Single deployment pipeline
- ✅ No separate backend hosting costs

---

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Test API endpoints manually
3. Verify environment variables are set
4. Check MongoDB connection and IP whitelist

Ready to deploy? Let's start with Option 1! 🚀 