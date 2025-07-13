# NeighborFit Deployment Guide

## 🚨 Current Issue: Vercel Deployment Problems

Based on the terminal output, there are several issues with the current Vercel deployment:

### Issues Identified:
1. **404 NOT_FOUND Error** - The deployment is not finding the application
2. **Build Configuration** - Vercel may not be building from the correct directory
3. **Environment Variables** - API URL not properly configured for production

## 🛠️ Step-by-Step Fix

### 1. Vercel Project Settings

Go to your Vercel dashboard and update these settings:

**Framework Preset:** React
**Root Directory:** `neighborfit/frontend`
**Build Command:** `npm run build`
**Output Directory:** `build`
**Install Command:** `npm install`

### 2. Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

```
REACT_APP_API_URL=https://your-backend-url.com/api
GENERATE_SOURCEMAP=false
```

### 3. Update vercel.json

The vercel.json has been updated with proper configuration:

```json
{
  "version": 2,
  "name": "neighborfit-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Local Testing Before Deployment

Test the build locally:

```bash
cd neighborfit/frontend
npm run build
npx serve -s build
```

### 5. Backend Deployment

Your backend needs to be deployed separately. Options:

**Option A: Railway**
```bash
# In backend directory
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option B: Render**
1. Connect your GitHub repo
2. Select backend directory
3. Set build command: `npm install`
4. Set start command: `npm start`

**Option C: Heroku**
```bash
# In backend directory
heroku create neighborfit-backend
git subtree push --prefix neighborfit/backend heroku main
```

### 6. Update Frontend API URL

Once backend is deployed, update the frontend environment variable:

```
REACT_APP_API_URL=https://your-backend-deployment-url.com/api
```

### 7. Redeploy Frontend

After updating the API URL, redeploy the frontend:

```bash
# Push changes to trigger Vercel deployment
git add .
git commit -m "fix: Update deployment configuration"
git push origin main
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails
**Solution:** Check that all dependencies are properly installed
```bash
cd neighborfit/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: API Calls Fail
**Solution:** Ensure CORS is properly configured in backend
```javascript
// In backend/src/app.js
app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue 3: Routing Issues
**Solution:** Ensure vercel.json has proper rewrites for SPA routing

### Issue 4: Environment Variables Not Working
**Solution:** 
1. Check Vercel dashboard environment variables
2. Ensure variables start with `REACT_APP_`
3. Redeploy after adding variables

## 📋 Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend environment variables configured
- [ ] vercel.json properly configured
- [ ] Build command works locally
- [ ] API endpoints accessible from frontend domain
- [ ] CORS properly configured
- [ ] SSL certificates working (https)

## 🚀 Quick Fix Commands

```bash
# 1. Fix local development
cd neighborfit/frontend
npm install
npm run build

# 2. Test build locally
npx serve -s build

# 3. Deploy backend (choose one platform)
# Railway: railway up
# Render: Connect via dashboard
# Heroku: git subtree push --prefix neighborfit/backend heroku main

# 4. Update frontend environment and redeploy
# Update REACT_APP_API_URL in Vercel dashboard
# Push changes to trigger redeploy
```

## 📞 Support

If you continue to have issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Test with a simple API call

## 🎯 Expected Result

After following these steps:
- ✅ Frontend accessible at your-domain.vercel.app
- ✅ Backend accessible at your-backend-url.com
- ✅ API calls working between frontend and backend
- ✅ All features functional in production 