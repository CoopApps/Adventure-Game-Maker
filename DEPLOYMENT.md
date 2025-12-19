# RetroQuest Game Builder - Deployment Guide

This guide provides step-by-step instructions for deploying the RetroQuest Game Builder using various methods.

## Quick Start (Test Locally)

Before deploying, test the application locally:

### Method 1: Direct File Opening
```bash
# Simply open index.html in your browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

⚠️ **Note:** Some browsers restrict localStorage when opening files directly. Use a local server for full functionality.

### Method 2: Python Server (Recommended for Testing)
```bash
# Python 3
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

### Method 3: Node.js Server
```bash
# Using npx (no installation needed)
npx serve

# Or with http-server
npx http-server -p 8000
```

---

## Deployment Option 1: GitHub Pages (FREE)

**Best for:** Free hosting, version control, simple updates

### Setup Steps

1. **Push code to GitHub** (if not already done):
```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select `main` branch
   - Click **Save**

3. **Access your app:**
   - URL: `https://YOUR-USERNAME.github.io/Adventure-Game-Maker/`
   - Wait 1-2 minutes for initial deployment

### Custom Domain (Optional)

1. Add a `CNAME` file:
```bash
echo "gamemaker.yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

2. Configure DNS:
   - Add CNAME record: `gamemaker` → `YOUR-USERNAME.github.io`

**Pros:** ✅ Free, automatic SSL, easy updates via git push
**Cons:** ❌ Public repository only (unless GitHub Pro)

---

## Deployment Option 2: Netlify (FREE)

**Best for:** Free hosting, continuous deployment, form handling

### Method A: Drag & Drop (Easiest)

1. Visit [netlify.com](https://netlify.com)
2. Sign up for free account
3. Drag your project folder onto the upload area
4. Done! Get a URL like `https://retroquest-abc123.netlify.app`

### Method B: Git Integration (Recommended)

1. **Connect GitHub repository:**
   - Click **New site from Git**
   - Choose **GitHub** and authorize
   - Select `Adventure-Game-Maker` repository

2. **Configure build settings:**
   - Build command: (leave empty for static site)
   - Publish directory: `/`
   - Click **Deploy site**

3. **Custom domain (optional):**
   - Go to **Domain settings**
   - Add custom domain
   - Follow DNS configuration instructions

### Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Pros:** ✅ Free SSL, CDN, continuous deployment, custom domains
**Cons:** ❌ 100GB bandwidth limit on free tier

---

## Deployment Option 3: Vercel (FREE)

**Best for:** Fast global CDN, serverless functions (future expansion)

### Setup Steps

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd /home/user/Adventure-Game-Maker
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? retroquest-game-builder
# - In which directory is your code located? ./
```

3. **Production deployment:**
```bash
vercel --prod
```

### Via Web Interface

1. Visit [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Import from GitHub
4. Select `Adventure-Game-Maker`
5. Click **Deploy**

**Pros:** ✅ Ultra-fast CDN, free SSL, preview deployments
**Cons:** ❌ 100GB bandwidth limit on free tier

---

## Deployment Option 4: Build Tools + Optimization

**Best for:** Production apps requiring minification and bundling

### Setup with Vite (Recommended)

1. **Initialize project:**
```bash
cd /home/user/Adventure-Game-Maker

# Create package.json
npm init -y

# Install Vite
npm install --save-dev vite
```

2. **Update package.json:**
```json
{
  "name": "retroquest-game-builder",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

3. **Create vite.config.js:**
```javascript
export default {
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
}
```

4. **Development:**
```bash
npm run dev
# Visit http://localhost:5173
```

5. **Production build:**
```bash
npm run build
# Output in dist/ folder
```

6. **Deploy dist/ folder** using any method above (GitHub Pages, Netlify, Vercel)

### Build Benefits

- ✅ Minified JavaScript (~40% size reduction)
- ✅ Optimized asset loading
- ✅ Tree shaking (remove unused code)
- ✅ Hot module replacement in development
- ✅ CSS preprocessing support

---

## Deployment Option 5: Progressive Web App (PWA)

**Best for:** Installable app experience, offline support

### Setup Steps

1. **Create manifest.json:**
```json
{
  "name": "RetroQuest Game Builder",
  "short_name": "RetroQuest",
  "description": "Create retro adventure games in your browser",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e1e1e",
  "theme_color": "#007acc",
  "orientation": "landscape",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

2. **Create service-worker.js:**
```javascript
const CACHE_NAME = 'retroquest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/core.js',
  '/select-module.js',
  '/room-module.js',
  '/hotspot-module.js',
  '/walkarea-module.js',
  '/object-module.js',
  '/character-module.js'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

3. **Add to index.html** (before closing `</body>`):
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#007acc">

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  }
</script>
```

4. **Create icons:**
```bash
# Create icons/ directory
mkdir icons

# Generate icons (use any online tool or ImageMagick)
# Save as icons/icon-192.png and icons/icon-512.png
```

5. **Deploy** using GitHub Pages, Netlify, or Vercel

### Testing PWA

1. Open in Chrome/Edge
2. DevTools → Application → Manifest
3. Check for errors
4. Click "Add to Home Screen" button in address bar

**Pros:** ✅ Installable, offline support, app-like experience
**Cons:** ❌ Requires HTTPS (all free hosts provide this)

---

## Deployment Option 6: Electron Desktop App

**Best for:** Native desktop application (Windows, Mac, Linux)

### Setup Steps

1. **Install dependencies:**
```bash
npm init -y
npm install --save-dev electron electron-builder
```

2. **Create main.js** (Electron main process):
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');

  // Open DevTools in development
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

3. **Create preload.js:**
```javascript
// Bridge between renderer and main process (if needed)
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});
```

4. **Update package.json:**
```json
{
  "name": "retroquest-game-builder",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mwl"
  },
  "build": {
    "appId": "com.retroquest.gamebuilder",
    "productName": "RetroQuest Game Builder",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!dist/**/*",
      "!node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "icon": "build/icon.icns"
    },
    "win": {
      "icon": "build/icon.ico"
    },
    "linux": {
      "icon": "build/icon.png",
      "category": "Development"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}
```

5. **Test locally:**
```bash
npm start
```

6. **Build distributables:**
```bash
# macOS (must build on Mac)
npm run build:mac

# Windows (can build on any platform)
npm run build:win

# Linux
npm run build:linux

# All platforms
npm run build:all
```

7. **Output:**
- macOS: `dist/RetroQuest Game Builder-1.0.0.dmg`
- Windows: `dist/RetroQuest Game Builder Setup 1.0.0.exe`
- Linux: `dist/retroquest-game-builder_1.0.0_amd64.deb`

### Enhanced Features (Optional)

**File System Access:**
```javascript
// In main.js
const { dialog } = require('electron');

// Add save/load functionality
ipcMain.handle('save-project', async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'RetroQuest Project', extensions: ['rqp'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return filePath;
  }
});
```

**Native Menus:**
```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New Project', click: () => { /* ... */ } },
      { label: 'Open Project', click: () => { /* ... */ } },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  // ... more menu items
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

**Pros:** ✅ Native app, file system access, no browser limitations
**Cons:** ❌ Large download (~100MB), complex build process

---

## Deployment Option 7: Docker Container

**Best for:** Self-hosting, enterprise deployments

### Dockerfile
```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run
```bash
# Build image
docker build -t retroquest-game-builder .

# Run container
docker run -d -p 8080:80 retroquest-game-builder

# Visit http://localhost:8080
```

### Docker Compose
```yaml
version: '3'
services:
  retroquest:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

**Pros:** ✅ Self-hosted, easy deployment, scalable
**Cons:** ❌ Requires Docker knowledge, infrastructure to host

---

## Comparison Table

| Method | Cost | Difficulty | Best For |
|--------|------|-----------|----------|
| GitHub Pages | Free | ⭐ Easy | Open source projects |
| Netlify | Free | ⭐ Easy | Quick deployments |
| Vercel | Free | ⭐ Easy | Fast global access |
| Vite Build | Free | ⭐⭐ Medium | Optimized production |
| PWA | Free | ⭐⭐ Medium | Mobile-friendly apps |
| Electron | Free | ⭐⭐⭐ Hard | Desktop applications |
| Docker | Varies | ⭐⭐⭐ Hard | Self-hosting |

---

## Recommended Deployment Strategy

### For Most Users: Netlify or Vercel
1. Push code to GitHub
2. Connect to Netlify/Vercel
3. Auto-deploy on every push
4. Get free SSL and CDN

### For Desktop Users: Electron
1. Follow Electron setup
2. Build installers
3. Distribute via GitHub Releases

### For Maximum Reach: Hybrid Approach
1. **Web:** Deploy to Netlify/Vercel
2. **Desktop:** Build Electron app
3. **Mobile:** Add PWA manifest
4. **Documentation:** Host docs on GitHub Pages

---

## Post-Deployment Checklist

- ✅ Test all features in deployed environment
- ✅ Verify localStorage persistence works
- ✅ Check image upload functionality
- ✅ Test on different browsers (Chrome, Firefox, Safari)
- ✅ Test on mobile devices (if PWA)
- ✅ Set up custom domain (optional)
- ✅ Configure SSL certificate (usually automatic)
- ✅ Add Google Analytics (optional)
- ✅ Create GitHub releases for desktop builds
- ✅ Write announcement/launch post

---

## Troubleshooting

### Issue: LocalStorage not working
**Solution:** Ensure site is served over HTTPS (all free hosts provide this)

### Issue: CORS errors
**Solution:** Use proper web server, not direct file opening

### Issue: Images not loading
**Solution:** Check file paths are relative, not absolute

### Issue: Service Worker not registering
**Solution:** PWAs require HTTPS. Test on localhost or deployed HTTPS site

### Issue: Electron app won't build
**Solution:** Ensure all paths in package.json are correct. Check Node.js version compatibility

---

## Next Steps After Deployment

1. **Gather Feedback:** Share with users and collect feedback
2. **Analytics:** Add tracking to understand usage patterns
3. **Iterate:** Fix bugs and add requested features
4. **Marketing:** Share on social media, forums, product hunt
5. **Documentation:** Create video tutorials
6. **Monetization:** Consider premium features (optional)

---

## Support & Updates

### Automatic Updates (Web Deployments)
- GitHub Pages: Auto-updates on git push
- Netlify/Vercel: Auto-deploys on git push
- Manual: Replace files via FTP/SFTP

### Automatic Updates (Electron)
Use `electron-updater` for automatic app updates:

```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

Configure in package.json:
```json
{
  "publish": {
    "provider": "github",
    "owner": "YOUR-USERNAME",
    "repo": "Adventure-Game-Maker"
  }
}
```

---

**Ready to deploy?** Choose the option that best fits your needs and follow the steps above. For most users, we recommend starting with **Netlify or Vercel** for the easiest deployment experience.
