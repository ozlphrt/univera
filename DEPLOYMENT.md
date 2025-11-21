# Deployment Guide

## GitHub Setup

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `univera` (or your preferred name)
   - Choose Public or Private
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/univera.git
   git branch -M main
   git push -u origin main
   ```

## Deployment Options

### Option 1: Vercel (Recommended for Vite/React)

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Click "Deploy"

3. **Environment Variables** (if needed):
   - Add in Vercel dashboard → Settings → Environment Variables:
     - `VITE_COLLEGE_SCORECARD_API_KEY` (if using API)
     - `VITE_SUPABASE_URL` (if using Supabase)
     - `VITE_SUPABASE_ANON_KEY` (if using Supabase)

4. **Custom Domain** (optional):
   - Add domain in Vercel dashboard → Settings → Domains

### Option 2: Netlify

1. **Deploy via Netlify Dashboard**:
   - Go to https://netlify.com
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

2. **Environment Variables**:
   - Site settings → Environment variables → Add variables

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://YOUR_USERNAME.github.io/univera"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test onboarding flow
- [ ] Verify college filtering works
- [ ] Check fit score breakdown displays
- [ ] Test PWA installation (if applicable)
- [ ] Verify environment variables are set
- [ ] Test API connections (if using external APIs)

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:
- Every push to `main` branch → Production deployment
- Pull requests → Preview deployments

