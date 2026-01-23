# 🚨 API Base URL Fix - Deployment Guide

## Problem Identified
The frontend configuration is **correct** in the codebase, but Vercel needs the environment variables to be configured in the dashboard to work in production.

## ✅ What's Already Fixed

### 1. Environment Variables Created
- `.env.local` - For local development
- `.env.production` - For production builds

Both files contain:
```env
NEXT_PUBLIC_API_URL=https://electronic-shop-server-f1vf.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibW9oYW1lZG11YmFyYWsxNCIsImEiOiJjbWs0ODlpZ3UwNWZqM2ZzN3RrNXFlY2t4In0.BsVOsWPl530nlWuLGGEKqw
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dursqsqez
```

### 2. Axios Configuration Verified
- **File:** `src/services/api.ts`
- **BaseURL:** Uses `process.env.NEXT_PUBLIC_API_URL` with fallback
- **All services** use this axios instance correctly

### 3. API Paths Verified
All API calls use relative paths that get appended to the baseURL:
- `/categories` → `https://electronic-shop-server-f1vf.vercel.app/api/categories` ✅
- `/brands` → `https://electronic-shop-server-f1vf.vercel.app/api/brands` ✅
- `/products` → `https://electronic-shop-server-f1vf.vercel.app/api/products` ✅

## 🔧 Required Actions

### Step 1: Configure Vercel Environment Variables

Since `.env` files are gitignored (for security), you must set environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development** environments:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_API_URL` | `https://electronic-shop-server-f1vf.vercel.app/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://electronic-shop-server-f1vf.vercel.app` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1IjoibW9oYW1lZG11YmFyYWsxNCIsImEiOiJjbWs0ODlpZ3UwNWZqM2ZzN3RrNXFlY2t4In0.BsVOsWPl530nlWuLGGEKqw` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dursqsqez` |

### Step 2: Redeploy the Frontend

After setting environment variables, trigger a new deployment:

**Option A: Via Git Push**
```bash
git add .
git commit -m "chore: add production environment configuration"
git push origin main
```

**Option B: Via Vercel CLI**
```bash
vercel --prod
```

**Option C: Via Vercel Dashboard**
- Go to your project → **Deployments**
- Click the three dots on the latest deployment
- Select **Redeploy**

### Step 3: Verify the Fix

1. Open DevTools → **Network** tab
2. Navigate to a page that loads categories
3. Verify requests are going to:
   ```
   https://electronic-shop-server-f1vf.vercel.app/api/categories
   ```
   NOT:
   ```
   http://localhost:5000/categories
   ```

4. Check that responses are successful (200 status)

## 🔍 Why This Happened

- Environment variables in `.env` files are **not deployed** to Vercel (they're gitignored)
- Vercel requires environment variables to be set in the dashboard
- Without these variables, Next.js falls back to the hardcoded fallback URL in the code
- The fallback was using the deployed URL, so the code was correct, but Vercel might have had cached builds or missing environment variables

## 📝 Local Development

For local development, your `.env.local` file is already configured correctly. To test locally:

```bash
npm run dev
```

All requests will use: `https://electronic-shop-server-f1vf.vercel.app/api`

## ✅ Expected Result

After completing these steps:
- ✅ All API calls go to the deployed backend
- ✅ No requests hit localhost in production
- ✅ Categories load successfully (just like brands)
- ✅ All features work with the deployed API

## 🚨 If Issues Persist

1. **Clear build cache on Vercel:**
   - Settings → General → "Clear Cache and Redeploy"

2. **Check browser console for errors:**
   - Look for CORS issues
   - Verify the exact URL being called

3. **Verify backend is accessible:**
   ```bash
   curl https://electronic-shop-server-f1vf.vercel.app/api/categories
   ```

4. **Check if backend requires different CORS settings** for the frontend domain
