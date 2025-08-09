# TradeX Deployment Guide - Render

This guide will help you deploy TradeX to Render, a modern cloud platform for hosting web applications.

## 🚀 Quick Deployment Summary

**Build Command:** `npm ci && npm run build`  
**Start Command:** `npm start`  
**Node Version:** 18  
**Port:** Dynamic (uses `$PORT` environment variable)

### ✅ Build Status: **WORKING**

- Build time: ~6 seconds
- Total bundle size: ~1.1 MB (gzipped: ~577 kB)
- Chunked for optimal loading
- All dependencies resolved successfully

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Push your TradeX code to GitHub
3. **Google OAuth Credentials** - Set up from [console.cloud.google.com](https://console.cloud.google.com)

## 🔧 Step 1: Prepare Your Repository

Ensure your repository has these files (already created):

- ✅ `package.json` - Updated with deployment scripts
- ✅ `vite.config.ts` - Configured for production
- ✅ `render.yaml` - Render deployment configuration
- ✅ `.nvmrc` - Node.js version specification
- ✅ `Dockerfile` - Alternative deployment method

## 🌐 Step 2: Update OAuth Configuration

1. **Update Google OAuth Redirect URIs:**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" → "Credentials"
   - Edit your OAuth 2.0 Client ID
   - Add your Render domain to authorized origins and redirect URIs:

   ```
   Authorized JavaScript origins:
   - https://your-app-name.onrender.com

   Authorized redirect URIs:
   - https://your-app-name.onrender.com/callback
   ```

## 🚀 Step 3: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Connect Repository:**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the TradeX repository

2. **Configure Service:**

   ```
   Name: tradex (or your preferred name)
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables:**

   - Go to "Environment" tab
   - Add these variables:

   ```
   NODE_ENV=production
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete (~5-10 minutes)

### Option B: Using render.yaml (Auto-Deploy)

If you have `render.yaml` in your repo:

1. **Create Blueprint:**

   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml`

2. **Configure Environment Variables:**
   - Set the required environment variables in the Render dashboard
   - The blueprint will handle the rest automatically

## 🔒 Step 4: Configure Environment Variables

In Render Dashboard, set these environment variables:

### Required Variables:

```env
NODE_ENV=production
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
```

### Optional Variables:

```env
VITE_PROVER_ENDPOINT=https://your-prover-service.com/api/prove
```

**⚠️ Important:** Never commit real secrets to your repository. Always use environment variables in production.

## 🧪 Step 5: Test Your Deployment

1. **Access Your App:**

   - Visit your Render URL: `https://your-app-name.onrender.com`

2. **Test OAuth Flow:**

   - Try logging in with Google
   - Verify real user data is loaded (not "Test User")
   - Check browser console for any errors

3. **Verify Features:**
   - Test navigation between pages
   - Check profile page loads correctly
   - Confirm blockchain data fetching works

## 🔧 Troubleshooting

### Common Issues:

1. **"client_secret is missing" Error:**

   - Ensure `VITE_GOOGLE_CLIENT_SECRET` is set in Render environment variables
   - Check OAuth application configuration in Google Cloud Console

2. **OAuth Redirect Errors:**

   - Verify redirect URIs in Google Cloud Console match your Render domain
   - Ensure both `http://localhost:5173/callback` (dev) and `https://your-app.onrender.com/callback` (prod) are added

3. **Build Failures:**

   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **Environment Variables Not Working:**
   - Environment variables in Vite must start with `VITE_`
   - Rebuild your app after changing environment variables
   - Check that variables are set in Render dashboard, not just `render.yaml`

### Performance Tips:

1. **Enable Caching:**

   - Render automatically handles static file caching
   - Use the manual chunking in `vite.config.ts` for better caching

2. **Monitor Performance:**
   - Use Render's metrics dashboard
   - Monitor response times and error rates

## 📊 Monitoring and Logs

1. **View Logs:**

   - Go to Render Dashboard → Your Service → "Logs"
   - Monitor for errors and performance issues

2. **Health Checks:**
   - Render automatically performs health checks
   - Your app should respond to HTTP requests on the specified port

## 🔄 Auto-Deploy Setup

To enable automatic deployments:

1. **Connect GitHub:**

   - In Render service settings, ensure GitHub integration is enabled
   - Choose branch for auto-deploy (usually `main` or `master`)

2. **Deploy Triggers:**
   - Every push to your main branch will trigger a new deployment
   - You can also manually trigger deployments from the dashboard

## 💰 Pricing

- **Free Tier:** Perfect for development and testing

  - 750 hours/month of usage
  - Apps sleep after 15 minutes of inactivity
  - Custom domains supported

- **Paid Plans:** For production use
  - No sleep time
  - Better performance
  - More resources

## 🛠️ Alternative Deployment Options

If you prefer other platforms, these files also support:

- **Docker:** Use the included `Dockerfile`
- **Vercel:** Update build command to `npm run build`
- **Netlify:** Configure as SPA with `_redirects` file
- **Railway:** Use same build/start commands

## 📞 Support

If you encounter issues:

1. Check the [Render Documentation](https://render.com/docs)
2. Review your build and runtime logs
3. Verify OAuth configuration in Google Cloud Console
4. Ensure all environment variables are correctly set

---

🎉 **Congratulations!** Your TradeX application should now be live on Render with real OAuth authentication!
