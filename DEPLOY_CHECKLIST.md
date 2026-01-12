# 🚀 Quick Deployment Checklist

Follow these steps in order. Total time: ~30 minutes.

## ☁️ Step 1: Railway (Backend + Database)

1. [ ] Go to https://railway.app and sign in with GitHub
2. [ ] Click "New Project" → "Deploy from GitHub repo"
3. [ ] Select your `portfolio-site` repository
4. [ ] Click "New" → "Database" → "Add PostgreSQL"
5. [ ] Click "New" → "GitHub Repo" → Select `portfolio-site`
6. [ ] Configure backend service:
   - Root Directory: `backend`
   - Dockerfile Path: `backend/Dockerfile`
7. [ ] Add environment variables (Variables tab):
   ```
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_SSLMODE=require
   PORT=8000
   ENV=production
   JWT_SECRET=<generate-a-random-string-here>
   FRONTEND_URL=https://your-app.vercel.app
   ```
8. [ ] Settings → Networking → "Generate Domain"
9. [ ] Copy your backend URL (e.g., `https://portfolio-backend-production.up.railway.app`)

---

## 🚀 Step 2: Vercel (Frontend)

1. [ ] Go to https://vercel.com and sign in with GitHub
2. [ ] Click "Add New..." → "Project"
3. [ ] Import `portfolio-site` repository
4. [ ] Configure:
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
5. [ ] Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```
6. [ ] Click "Deploy"
7. [ ] Copy your Vercel URL (e.g., `https://portfolio-site-abc123.vercel.app`)

---

## 🔄 Step 3: Update Backend CORS

1. [ ] Go back to Railway → Backend service → Variables
2. [ ] Update `FRONTEND_URL` with your actual Vercel URL
3. [ ] Railway will auto-redeploy

---

## 💾 Step 4: Setup Database

Choose one method:

### Method A: Railway CLI (Easiest)
```bash
npm install -g @railway/cli
railway login
railway link
railway run psql $DATABASE_URL < backend/internal/database/migrations/001_initial_schema.sql
railway run psql $DATABASE_URL < backend/internal/database/migrations/002_create_users_table.sql
railway run psql $DATABASE_URL < backend/internal/database/seed_admin_user.sql
```

### Method B: Railway Dashboard
1. [ ] Railway → PostgreSQL service → "Data" tab
2. [ ] Click "Query"
3. [ ] Copy/paste and run each SQL file:
   - `001_initial_schema.sql`
   - `002_create_users_table.sql`
   - `seed_admin_user.sql`

---

## ✅ Step 5: Test Everything

1. [ ] Visit your Vercel URL
2. [ ] Check homepage loads
3. [ ] Click "Admin" → Login with:
   - Email: `admin@portfolio.com`
   - Password: `admin123` (CHANGE THIS IMMEDIATELY!)
4. [ ] Test creating/editing content
5. [ ] Visit `/blog`, `/cv`, `/contact`
6. [ ] Test contact form

---

## 🔒 Step 6: Secure Your Site

1. [ ] Change admin password immediately
2. [ ] Update JWT_SECRET to a strong random string
3. [ ] Add custom domain (optional)
4. [ ] Configure SMTP for contact form (optional)

---

## 🎉 You're Live!

Your portfolio is now live on:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

Share your portfolio with recruiters! 🚀

---

## 📱 Custom Domain (Optional)

### Buy a domain (Free options):
- Freenom (free .tk, .ml, .ga domains)
- Get a .dev domain (~$12/year)

### Setup:
1. **Vercel**: Settings → Domains → Add domain
2. **Railway**: Settings → Networking → Add domain
3. Update DNS records at your registrar

---

## 📊 Monitoring

- **Railway Dashboard**: Monitor backend usage/logs
- **Vercel Dashboard**: View frontend analytics/logs
- **Railway free credit**: $5/month (resets monthly)

---

## ⚠️ Important Notes

- Railway requires credit card after 500 hours
- Vercel is completely free for personal use
- Keep your JWT_SECRET secure
- Backup your database regularly (Railway dashboard)

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
