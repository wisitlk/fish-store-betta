# Deployment Readme

## Quick Start Deployment Guide

Your Thailand Betta Fish e-commerce platform is now ready to deploy!

### Prerequisites Checklist
- [ ] GitHub account created
- [ ] Vercel account created (use GitHub to sign up)
- [ ] Render account created (use GitHub to sign up)
- [ ] Custom domain purchased (if you have one)

### Step 1: Push to GitHub

```bash
# Make sure you're in the project root directory
cd "c:\Users\AZC008\Documents\fish store betta"

# Add all files
git add .

# Commit
git commit -m "Ready for deployment: Thailand Betta Fish platform"

# Create a new repository on GitHub (https://github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/thailand-betta-fish.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `thailand-betta-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Go`
   - **Build Command**: `go build -o main .`
   - **Start Command**: `./main`
5. Add environment variables (click "Add Environment Variable"):
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   JWT_SECRET=your_secret_key_minimum_32_characters
   FRONTEND_URL=https://yourdomain.com
   ```
6. Create a PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Copy the "Internal Database URL"
   - Add it as `DATABASE_URL` environment variable to your web service
7. Click "Create Web Service"

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
6. Click "Deploy"

### Step 4: Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to your Vercel project → Settings → Domains
2. Add your domain (e.g., `thailandbettafish.com`)
3. Follow DNS configuration instructions

#### For Backend API (Render):
1. Go to your Render service → Settings → Custom Domain
2. Add subdomain (e.g., `api.thailandbettafish.com`)
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Render environment variables to your actual domain

### Step 5: Update Google OAuth

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized JavaScript origins:
   - `https://yourdomain.com` (or your Vercel URL)
5. Add authorized redirect URIs:
   - `https://yourdomain.com`

### Troubleshooting

**Backend not starting?**
- Check Render logs for errors
- Verify all environment variables are set
- Make sure DATABASE_URL is connected

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` matches your Render backend URL
- Check backend CORS settings allow your frontend domain
- Wait ~30 seconds - Render free tier "wakes up" from sleep

**Google OAuth not working?**
- Verify redirect URIs in Google Console
- Check that `VITE_GOOGLE_CLIENT_ID` matches your Google Console credentials
- Make sure your domain is added to authorized origins

### Next Steps After Deployment

1. Test creating a product from admin panel
2. Verify image uploads work
3. Test user role management
4. Check that products display correctly on homepage
5. Test the complete purchase flow

---

**Your App URLs:**
- Frontend: Check Vercel dashboard for URL
- Backend API: Check Render dashboard for URL  
- Swagger Docs: `https://your-backend.onrender.com/swagger/index.html`
