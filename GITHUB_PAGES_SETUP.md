# GitHub Pages Setup

Your application is now configured for GitHub Pages deployment!

## Your Application URL

Once enabled, your app will be available at:
**https://ozlphrt.github.io/univera/**

## Enable GitHub Pages

1. Go to your repository: https://github.com/ozlphrt/univera
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Click **Save**

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) will automatically:
- Build your app when you push to `main` branch
- Deploy to GitHub Pages
- Update the site automatically

## First Deployment

After enabling GitHub Pages:
1. The workflow will run automatically (check the **Actions** tab)
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Your site will be live at: `https://ozlphrt.github.io/univera/`

## Manual Deployment (Alternative)

If you prefer manual deployment, you can also run:
```bash
npm run deploy
```

This will deploy to the `gh-pages` branch, but the GitHub Actions method is recommended.

## Notes

- The base path is set to `/univera/` in `vite.config.ts`
- All routes will work correctly with this base path
- The site will automatically rebuild on every push to `main`

