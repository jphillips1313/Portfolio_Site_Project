# 🚀 Free Production Deployment Guide

This guide will walk you through deploying your portfolio site for **FREE** using Vercel (frontend) and Railway (backend + database).

## Total Cost: $0/month (within free tiers)

---

## Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- Railway account (sign up with GitHub)

---

## Part 1: Deploy Database & Backend (Railway)

Railway offers **$5/month free credit** which is enough for a small portfolio site.

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account if not already
4. Select `portfolio-site` repository

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a Postgres instance
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. Note these variables (we'll use them later):
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### Step 4: Deploy Backend

1. In your Railway project, click "New"
2. Select "GitHub Repo" → Choose your `portfolio-site` repo
3. Railway will detect your Docker setup
4. Click on the backend service
5. Go to "Settings" tab:
   - **Root Directory**: `/backend`
   - **Dockerfile Path**: `/backend/Dockerfile`
6. Go to "Variables" tab and add:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_SSLMODE=require
PORT=8000
ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-NOW
FRONTEND_URL=https://your-vercel-url.vercel.app
```

7. Railway will automatically deploy your backend
8. Go to "Settings" → "Networking" → "Generate Domain"
9. Copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Step 5: Run Database Migrations

1. In Railway, click on your backend service
2. Go to the "Deployments" tab
3. Once deployed, you need to run migrations manually
4. You can use Railway's CLI or pgAdmin to connect and run your migration SQL files

---

## Part 2: Deploy Frontend (Vercel)

Vercel is **completely free** for personal projects and offers unlimited bandwidth.

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import your `portfolio-site` repository
3. Vercel will detect Next.js automatically

### Step 3: Configure Build Settings

1. **Root Directory**: `frontend`
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
```

**Important**: Replace `your-railway-backend-url` with your actual Railway backend URL from Part 1, Step 4.

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your site is now live! 🎉

### Step 6: Get Your Production URL

1. Vercel will give you a URL like: `https://portfolio-site-abc123.vercel.app`
2. Copy this URL

### Step 7: Update Backend Environment Variable

1. Go back to Railway
2. Click on your backend service
3. Go to "Variables" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Backend will automatically redeploy

---

## Part 3: Custom Domain (Optional, Free)

### For Vercel (Frontend):

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `jackphillips.dev`)
4. Follow DNS instructions from your domain registrar

### For Railway (Backend):

1. Go to your Railway backend service
2. Click "Settings" → "Networking"
3. Add custom domain (e.g., `api.jackphillips.dev`)
4. Update DNS records as instructed

---

## Part 4: Initial Database Setup

After deployment, you need to populate your database:

### Option 1: Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway connect postgres

# Run migrations
\i /path/to/your/migrations/001_initial_schema.sql
\i /path/to/your/migrations/002_create_users_table.sql

# Create admin user
\i /path/to/your/seed_admin_user.sql
```

### Option 2: pgAdmin or TablePlus

1. Get database connection details from Railway
2. Connect using pgAdmin or TablePlus
3. Run your migration SQL files manually

---

## Part 5: Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds (`https://your-backend-url.up.railway.app/health`)
- [ ] Can log into admin panel
- [ ] Projects load on homepage
- [ ] Blog posts display correctly
- [ ] CV page works
- [ ] Contact form submits (won't send email without SMTP)
- [ ] Analytics page shows data

---

## Monitoring & Maintenance

### Railway (Backend):

- Free tier: $5/month credit
- Usage resets monthly
- Monitor usage in Railway dashboard

### Vercel (Frontend):

- Completely free for personal use
- Unlimited bandwidth
- 100GB-hours of serverless function execution

---

## Costs Breakdown

| Service            | Free Tier       | Your Usage  | Cost         |
| ------------------ | --------------- | ----------- | ------------ |
| Vercel (Frontend)  | Unlimited       | Small site  | $0           |
| Railway (Backend)  | $5 credit/month | ~$3-4/month | $0           |
| Railway (Database) | Included        | Small DB    | $0           |
| **Total**          |                 |             | **$0/month** |

---

## Alternative: 100% Free (No Credit Card)

If you want to avoid Railway's eventual credit card requirement:

**Option A: Render (Free Tier)**

- Backend: Render Web Service (Free)
- Database: Render PostgreSQL (Free)
- Limitation: Sleeps after 15 mins of inactivity

**Option B: Fly.io**

- Backend: Fly.io (Free tier)
- Database: Fly.io Postgres (Free)
- More complicated setup

I recommend Railway for the best experience, but Render is a solid alternative.

---

## Troubleshooting

### Frontend can't connect to backend

- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is deployed and healthy

### Database connection failed

- Verify `DB_SSLMODE=require` in Railway
- Check database variables are correct
- Ensure migrations were run

### Admin login doesn't work

- Check JWT_SECRET is set
- Verify admin user was created
- Check browser console for errors

---

## Need Help?

Check logs:

- **Railway**: Click service → "Deployments" → View logs
- **Vercel**: Click deployment → "View logs"

---

**You're ready to deploy! 🚀**

Start with Part 1 (Railway) and work your way through. Each step should take 5-10 minutes.
