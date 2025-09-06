# Vercel Deployment Guide for Portfolio Dashboard

## Prerequisites
1. Vercel account (free at vercel.com)
2. GitHub account
3. Your Supabase credentials

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio-dashboard.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (optional)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Supabase for Production

1. **Update Supabase RLS Policies:**
   - Go to your Supabase dashboard
   - Navigate to Authentication > Policies
   - Ensure your policies allow public access for demo data

2. **Configure CORS (if needed):**
   - In Supabase dashboard > Settings > API
   - Add your Vercel domain to allowed origins

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test all features:**
   - Dashboard loads correctly
   - Portfolio data displays
   - Analytics page works
   - Real-time updates function

## Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Troubleshooting

### Common Issues:

1. **Build Errors:**
   - Check that all dependencies are in package.json
   - Ensure TypeScript errors are resolved

2. **Environment Variables:**
   - Make sure all required env vars are set in Vercel
   - Check that variable names match exactly

3. **Supabase Connection:**
   - Verify Supabase URL and keys are correct
   - Check RLS policies allow public access

4. **CORS Issues:**
   - Add Vercel domain to Supabase allowed origins
   - Check middleware configuration

## Post-Deployment

1. **Set up custom domain (optional):**
   - In Vercel dashboard > Settings > Domains
   - Add your custom domain

2. **Enable Analytics:**
   - Vercel Analytics is already included
   - Check Vercel dashboard for usage stats

3. **Monitor Performance:**
   - Use Vercel's built-in monitoring
   - Check Supabase dashboard for database usage

## Your Supabase Credentials

Use these exact values in Vercel environment variables:

- **NEXT_PUBLIC_SUPABASE_URL**: `https://jxogjjqzrnhdnvoturjx.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2dqanF6cm5oZG52b3R1cmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTg1MjYsImV4cCI6MjA3MjYzNDUyNn0.2gCfsrCYQi4OIDYnZOG0Qa5UjYhjyJNgcd1U9Iwni_8`
- **SUPABASE_SERVICE_ROLE_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4b2dqanF6cm5oZG52b3R1cmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NTcwNTg1MjYsImV4cCI6MjA3MjYzNDUyNn0.GziPHvvacDNatGIKJ1ypA4i0-rGGU88PME23AVPwTo8`
