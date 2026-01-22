# Quick Action Guide - Vercel Environment Variables Setup

## 🎯 Immediate Actions Required

### Step 1: Update Frontend Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your **frontend project** (electro-shop-client or similar)
3. Click **Settings** → **Environment Variables**
4. Add these variables (for Production, Preview, and Development):

```
NEXT_PUBLIC_API_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibW9oYW1lZG11YmFyYWsxNCIsImEiOiJjbWs0ODlpZ3UwNWZqM2ZzN3RrNXFlY2t4In0.BsVOsWPl530nlWuLGGEKqw
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dursqsqez
```

5. Click **Save**
6. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**

### Step 2: Fix Backend Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your **backend project** (electronic-shop-server)
3. Click **Settings** → **Environment Variables**
4. **CRITICAL:** Add/verify these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database?retryWrites=true&w=majority
FRONTEND_URL=https://frontend-electronicshop.vercel.app
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=dursqsqez
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Click **Save**
6. **Redeploy the backend**

### Step 3: Update MongoDB Atlas IP Whitelist

1. Go to https://cloud.mongodb.com/
2. Select your cluster
3. Click **Network Access** in the left sidebar
4. Click **Add IP Address**
5. Select **"Allow access from anywhere"** (0.0.0.0/0)
   - Or add Vercel-specific IPs if you prefer more security
6. Click **Confirm**

### Step 4: Update Backend CORS Configuration

In your backend code, find the CORS configuration (usually in `server.js` or `app.js`):

**Current (Wrong):**
```javascript
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
```

**Update to (Correct):**
```javascript
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
};
```

Or if you want multiple origins:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'https://frontend-electronicshop.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
```

Then:
1. Commit and push changes to backend
2. Vercel will auto-deploy

## ⏱️ Expected Timeline

- Frontend environment variables: 2 minutes
- Frontend redeploy: 2-3 minutes
- Backend environment variables: 2 minutes
- MongoDB IP whitelist: 1 minute
- Backend code update: 5 minutes
- Backend redeploy: 2-3 minutes

**Total: ~15 minutes**

## ✅ Testing After Setup

Once all steps are complete, test:

```bash
# Test backend health
curl https://electronic-shop-server-f1vf.vercel.app/api/products

# Test CORS
curl -H "Origin: https://frontend-electronicshop.vercel.app" \
     -I https://electronic-shop-server-f1vf.vercel.app/api/products
```

Then visit:
- https://frontend-electronicshop.vercel.app/
- Check browser console for errors
- Try loading products, authentication, etc.

## 🆘 If Something Goes Wrong

### Backend still returns 500
- Check Vercel logs: Dashboard → Backend Project → Deployments → View Function Logs
- Verify MONGODB_URI is correct
- Check MongoDB Atlas shows active connections

### CORS errors persist
- Verify FRONTEND_URL is set correctly
- Check CORS code was updated and deployed
- Clear browser cache

### Frontend shows old API URL
- Verify environment variables are saved in Vercel
- Make sure you redeployed after adding variables
- Check that variables are set for "Production" environment

## 📞 Need Help?

Check these logs:
- Frontend: https://vercel.com/[your-username]/[frontend-project]/deployments
- Backend: https://vercel.com/[your-username]/[backend-project]/deployments

Look for:
- Build errors
- Runtime errors
- Function invocation errors
