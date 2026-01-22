# Deployment Configuration Guide

## ✅ Frontend Deployment Status

**Deployed URL:** https://frontend-electronicshop.vercel.app/
**Backend API:** https://electronic-shop-server-f1vf.vercel.app/

## Changes Made

### 1. Environment Variables Updated

The `.env.local` file has been updated to point to the production backend:

```env
NEXT_PUBLIC_API_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://electronic-shop-server-f1vf.vercel.app
```

### 2. Code Updates

All localhost fallback URLs have been updated in the following files:
- [src/api/axios.ts](src/api/axios.ts)
- [src/services/api.ts](src/services/api.ts)
- [src/hooks/useSocket.ts](src/hooks/useSocket.ts)
- [src/app/admin/messages/page.tsx](src/app/admin/messages/page.tsx)
- [src/app/admin/jobs/page.tsx](src/app/admin/jobs/page.tsx)
- [src/components/chat/ChatPopup.tsx](src/components/chat/ChatPopup.tsx)
- [src/components/admin/PortfolioForm.tsx](src/components/admin/PortfolioForm.tsx)
- [src/app/(public)/product/[id]/page.tsx](src/app/(public)/product/[id]/page.tsx)

## ⚠️ Backend Issues Identified

### 1. Database Connection Issue

**Error:** `Operation 'products.countDocuments()' buffering timed out after 10000ms`

**Cause:** The backend cannot connect to MongoDB. This is likely due to:
- MongoDB connection string not set in Vercel environment variables
- MongoDB Atlas IP whitelist not allowing Vercel's IP addresses
- Database credentials not configured correctly

**Solution Required on Backend:**
1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Add/verify: `MONGODB_URI` or `MONGO_URI` with the correct connection string
3. In MongoDB Atlas:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs) or Vercel's specific IPs
4. Redeploy the backend after making these changes

### 2. CORS Configuration Issue

**Current CORS setting:** `access-control-allow-origin: http://localhost:3000`

**Required CORS setting:** Should allow `https://frontend-electronicshop.vercel.app`

**Solution Required on Backend:**

The backend CORS configuration needs to be updated. Look for CORS middleware configuration (usually in `server.js` or `app.js`):

```javascript
// Current (incorrect):
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

// Should be (correct):
const corsOptions = {
    origin: [
        'http://localhost:3000',  // For local development
        'https://frontend-electronicshop.vercel.app'  // Production frontend
    ],
    credentials: true
};

app.use(cors(corsOptions));
```

Or use environment variables:

```javascript
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
};
```

Then add to backend's Vercel environment variables:
```
FRONTEND_URL=https://frontend-electronicshop.vercel.app
```

## 🔧 Environment Variables Needed

### Backend Environment Variables (Vercel)

The backend needs these environment variables configured in Vercel:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Frontend URL (for CORS)
FRONTEND_URL=https://frontend-electronicshop.vercel.app

# JWT Secret
JWT_SECRET=your_secret_key

# Cloudinary (if used)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Socket.IO (if needed)
SOCKET_PORT=5000

# Any other backend-specific variables
```

### Frontend Environment Variables (Vercel)

These should be configured in Vercel for the frontend project:

```env
NEXT_PUBLIC_API_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 📋 Testing Checklist

Once the backend issues are fixed, test these flows:

### Public Features
- [ ] Homepage loads correctly
- [ ] Product listing page displays products
- [ ] Individual product page shows details
- [ ] Search functionality works
- [ ] Filter and sort work
- [ ] Add to cart functionality
- [ ] Cart page displays items
- [ ] Wishlist functionality

### Authentication
- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] OTP verification (if applicable)
- [ ] Logout

### Checkout Flow
- [ ] Checkout process
- [ ] Order placement
- [ ] Order confirmation
- [ ] Invoice generation

### Admin Features
- [ ] Admin login
- [ ] Dashboard loads
- [ ] Product management (CRUD)
- [ ] Category management
- [ ] Brand management
- [ ] Order management
- [ ] Customer management
- [ ] Portfolio management
- [ ] Chat/messaging (Socket.IO)

## 🚀 Deployment Commands

### To Deploy Frontend Changes to Vercel:

```bash
# If using Vercel CLI
vercel --prod

# Or push to main branch (if auto-deploy is configured)
git add .
git commit -m "Update API URLs for production"
git push origin main
```

### To Rebuild After Environment Variable Changes:

1. Update environment variables in Vercel dashboard
2. Trigger a new deployment (redeploy)
3. Wait for build to complete
4. Test the application

## 🔍 Debugging Tips

### Check Console Errors
Open browser DevTools (F12) → Console tab and look for:
- CORS errors
- Network errors
- API request failures

### Check Network Tab
DevTools → Network tab:
- Verify API requests are going to the correct URL
- Check response status codes
- Inspect response headers for CORS settings

### Check Vercel Logs
- Frontend logs: Vercel Dashboard → Your Project → Deployments → Select deployment → Runtime Logs
- Backend logs: Same process for backend project

### Test API Directly
```bash
# Test if backend is responding
curl https://electronic-shop-server-f1vf.vercel.app/api/products

# Test with CORS headers
curl -H "Origin: https://frontend-electronicshop.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://electronic-shop-server-f1vf.vercel.app/api/products
```

## 📝 Next Steps

1. **Fix Backend Database Connection**
   - Configure MongoDB URI in Vercel
   - Update MongoDB Atlas IP whitelist
   - Redeploy backend

2. **Fix Backend CORS Configuration**
   - Update CORS settings to allow frontend domain
   - Add environment variable for frontend URL
   - Redeploy backend

3. **Update Frontend Environment Variables in Vercel**
   - Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables
   - Add all required variables listed above
   - Redeploy frontend

4. **Test All Features**
   - Follow the testing checklist above
   - Fix any issues that arise

5. **Monitor Production**
   - Check Vercel logs regularly
   - Monitor error tracking (if Sentry or similar is set up)
   - Set up alerts for critical errors

## 🌐 URLs Summary

- **Frontend (Production):** https://frontend-electronicshop.vercel.app/
- **Backend (Production):** https://electronic-shop-server-f1vf.vercel.app/
- **Frontend (Local):** http://localhost:3000
- **Backend (Local):** http://localhost:5000

## ✨ Final Notes

The frontend is now fully configured to connect to the production backend. However, the backend requires the following fixes:

1. ✅ **Frontend:** All API URLs updated to production
2. ⚠️ **Backend:** Needs database connection fix
3. ⚠️ **Backend:** Needs CORS configuration update

Once the backend issues are resolved, the application should work seamlessly in production.
