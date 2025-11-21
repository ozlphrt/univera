# Testing PWA Install Prompt

## Quick Test Steps

### 1. Access the Preview Server

The preview server is running at: **http://localhost:4173**

Open this URL in your browser (Chrome, Edge, or Firefox).

### 2. Check PWA Requirements

Open **DevTools** (F12) and go to **Application** tab:

#### A. Verify Manifest
- Click **Manifest** in the left sidebar
- Should show:
  - ✅ Name: "Univera — College Guidance Made Simple"
  - ✅ Short name: "Univera"
  - ✅ Icons: 192x192 and 512x512 present
  - ✅ Start URL: "/"
  - ✅ Display: "standalone"

#### B. Verify Service Worker
- Click **Service Workers** in the left sidebar
- Should show:
  - ✅ Status: "activated and is running"
  - ✅ Source: `sw.js`

#### C. Check Installability
- Look for **"Installable"** badge or check console for installability errors
- Common issues:
  - Missing icons → Replace placeholder PNGs
  - HTTPS required → Use `localhost` (works) or deploy to HTTPS

### 3. Trigger Install Prompt

#### Method 1: Browser UI (Chrome/Edge)
1. Look for **install icon** in address bar (usually a "+" or download icon)
2. Click it to see install prompt
3. Or use browser menu: **⋮** → **Install Univera...**

#### Method 2: DevTools Console
Open Console and run:
```javascript
// Check if installable
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker supported');
}
if (window.deferredPrompt) {
  console.log('✅ Install prompt available');
} else {
  console.log('⚠️ Install prompt not yet available');
}
```

#### Method 3: Programmatic Trigger (for testing)
Add this to your app temporarily:
```typescript
// In App.tsx or a test component
useEffect(() => {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ Install prompt ready');
    
    // Show custom install button
    // deferredPrompt.prompt();
  });
  
  return () => {
    window.removeEventListener('beforeinstallprompt', () => {});
  };
}, []);
```

### 4. Test Installation

1. Click **Install** in the prompt
2. App should install as standalone window
3. Check:
   - ✅ Opens without browser chrome
   - ✅ Has Univera icon
   - ✅ Works offline (after first load)

### 5. Verify Offline Functionality

1. Install the PWA
2. Open DevTools → **Network** tab
3. Enable **"Offline"** checkbox
4. Refresh the app
5. Should still load (cached by service worker)

## Troubleshooting

### Install Prompt Not Showing?

**Common causes:**
1. **Already installed** → Uninstall first, then retest
2. **Missing icons** → Ensure `pwa-192x192.png` and `pwa-512x512.png` exist
3. **Not HTTPS/localhost** → PWAs require secure context
4. **Manifest errors** → Check Application → Manifest for errors
5. **Service worker not registered** → Check Application → Service Workers

### Quick Fixes

```bash
# Rebuild and restart preview
npm run build
npm run preview

# Clear browser cache
# DevTools → Application → Clear storage → Clear site data
```

### Test on Mobile Device

1. **Local network access:**
   ```bash
   # Find your local IP (Windows)
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Access from phone:**
   - Connect phone to same WiFi
   - Open: `http://YOUR_IP:4173` (e.g., `http://192.168.1.100:4173`)
   - Test install prompt on mobile browser

3. **Or use ngrok/tunneling:**
   ```bash
   # Install ngrok, then:
   ngrok http 4173
   # Use the ngrok URL on your phone
   ```

## Expected Results

✅ **Manifest**: Valid, all fields present  
✅ **Service Worker**: Registered and active  
✅ **Icons**: Both sizes present  
✅ **Install Prompt**: Appears after page load  
✅ **Offline**: App works without network  
✅ **Standalone**: Opens without browser UI

## Next Steps

Once install prompt works:
- Replace placeholder icons with branded Univera icons
- Test on actual mobile device
- Deploy to staging/production (HTTPS required)

