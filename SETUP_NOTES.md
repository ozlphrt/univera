# Setup Notes

## PWA Icons

The PWA manifest requires proper icon files. Currently, placeholder files are in place. Before deploying:

1. Generate proper PWA icons:
   - `pwa-192x192.png` (192x192px)
   - `pwa-512x512.png` (512x512px)
   - `apple-touch-icon.png` (180x180px)
   - `favicon.ico` (32x32px or multi-size)

2. You can use tools like:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing PWA Installability

**Quick Guide:** See `TEST_PWA_INSTALL.md` for detailed instructions.

**Quick Steps:**
1. Build the project: `npm run build`
2. Serve the build: `npm run preview`
3. Open http://localhost:4173 in Chrome/Edge
4. Open DevTools (F12) → Application tab:
   - Check **Manifest** (should show Univera details)
   - Check **Service Workers** (should be active)
5. Look for install icon in address bar or use browser menu → **Install Univera...**
6. Test offline functionality (Network tab → Offline checkbox)

## Next Steps

After PHASE 1 completion:
- [ ] Add proper PWA icons
- [ ] Configure Supabase project
- [ ] Test PWA installation on mobile device
- [ ] Begin PHASE 2: Onboarding module

