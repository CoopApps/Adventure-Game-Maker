# RetroQuest Game Builder - Quick Start Guide

## 🎮 Your Game Maker is Ready!

All core modules have been implemented and the project is ready to use. Here's how to get started immediately.

## ⚡ Test It Right Now (60 seconds)

### Option 1: Python Server (Recommended)
```bash
cd /home/user/Adventure-Game-Maker
python3 -m http.server 8000
```
Then open: **http://localhost:8000**

### Option 2: Direct Browser
```bash
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

⚠️ Note: Some browsers restrict localStorage when opening files directly. Use Option 1 for full functionality.

## 📁 What You Have

### Core Application Files (243 KB total)
- ✅ **index.html** (29 KB) - Complete UI with dark theme
- ✅ **core.js** (17 KB) - Module system and rendering engine
- ✅ **character-module.js** (48 KB) - 6 character templates
- ✅ **hotspot-module.js** (29 KB) - Interactive areas with freehand drawing
- ✅ **walkarea-module.js** (26 KB) - Movement zones
- ✅ **object-module.js** (34 KB) - 10-item library system
- ✅ **room-module.js** (20 KB) - Scene management
- ✅ **select-module.js** (24 KB) - Universal selection tool

### Documentation (42 KB total)
- ✅ **README.md** (6.4 KB) - Feature overview and basics
- ✅ **ARCHITECTURE.md** (21 KB) - Technical deep-dive
- ✅ **DEPLOYMENT.md** (15 KB) - 7 deployment methods

## 🎯 Your First Game in 5 Minutes

1. **Start the server** (see above)

2. **Create a room:**
   - Click the Room tool (🏠)
   - Name it "Starting Room"
   - Upload a background image (or skip for default)

3. **Draw a walk area:**
   - Click the Walk Area tool (🚶)
   - Click 3-4 times to create a polygon
   - Right-click or double-click to finish

4. **Add a hotspot:**
   - Click the Hotspot tool (🔥)
   - Drag to draw an interactive area
   - Configure responses in the properties panel

5. **Place objects:**
   - Click the Object tool (📦)
   - Drag items from the library to the canvas

6. **Add a character:**
   - Click the Character tool (🎭)
   - Choose a template (Hero, Heroine, etc.)
   - Click to place on canvas

7. **Test your scene:**
   - Use Select tool (🔍) to move elements
   - Adjust properties
   - Save happens automatically (localStorage)

## 🚀 Deploy to the Web (5-10 minutes)

### Easiest: Netlify Drag & Drop

1. Visit [netlify.com](https://netlify.com)
2. Create free account
3. Drag the `Adventure-Game-Maker` folder onto the upload area
4. Get instant URL: `https://retroquest-xyz.netlify.app`
5. Share with the world! 🌍

### Alternative: GitHub Pages (Git Required)

```bash
# From your project directory
git add .
git commit -m "Ready for deployment"
git push origin main

# Then enable GitHub Pages:
# Settings → Pages → Source: main branch → Save
# URL: https://YOUR-USERNAME.github.io/Adventure-Game-Maker/
```

See **DEPLOYMENT.md** for 5 more deployment methods (Vercel, PWA, Electron, Docker, etc.)

## 📚 What's Next?

### Immediate Next Steps
1. ✅ **Test all features** - Try each tool
2. ✅ **Create a test game** - Follow 5-minute guide above
3. ✅ **Deploy** - Choose a deployment method
4. ⬜ **Optional: Add test-game-module.js** - Game preview functionality

### Future Enhancements (Roadmap)
- **Save/Load System** - Export/import projects as JSON
- **Game Export** - Generate playable game files
- **Animation Editor** - Frame-based sprite animations
- **Dialogue System** - Conversation trees
- **Inventory System** - Item management
- **Sound Integration** - Music and sound effects

See **README.md** section "Planned Features" for complete roadmap.

## 🛠️ Available Tools

| Tool | Icon | Purpose | Shortcut |
|------|------|---------|----------|
| Select | 🔍 | Universal selection | Click |
| Room | 🏠 | Scene management | - |
| Hotspot | 🔥 | Interactive areas | Drag to draw |
| Walk Area | 🚶 | Movement zones | Click to add points |
| Object | 📦 | Place items | Drag from library |
| Character | 🎭 | Add NPCs/player | Choose template |

### Keyboard Shortcuts
- **Delete** - Remove selected element
- **Escape** - Cancel current operation
- **Right-click** - Context menu

## 🎨 Canvas Specifications

- **Resolution:** 320×200 pixels (retro gaming standard)
- **Rendering:** Pixel-art mode (crisp, no smoothing)
- **Background Images:** Auto-resized to 320×200
- **Coordinate System:** (0,0) top-left to (319,199) bottom-right

## 📖 Documentation Structure

```
QUICK-START.md    ← You are here (immediate next steps)
    ↓
README.md         ← Feature overview, getting started
    ↓
ARCHITECTURE.md   ← Technical deep-dive, module system
    ↓
DEPLOYMENT.md     ← Production deployment options
```

**Read in order** for complete understanding, or jump to what you need.

## 🐛 Troubleshooting

### "Nothing appears on screen"
- **Check:** Is the server running? (python3 -m http.server 8000)
- **Check:** Did you open http://localhost:8000 (not file://)
- **Check:** Browser console for errors (F12)

### "Can't upload background image"
- **Check:** Is file a valid image? (PNG, JPG, GIF)
- **Check:** File size < 5MB recommended
- **Solution:** Images auto-resize to 320×200

### "Changes don't save"
- **Check:** Using http:// server (not file://)
- **Check:** Browser allows localStorage
- **Check:** Not in private/incognito mode

### "Module X isn't working"
- **Check:** All JS files loaded? (View browser console)
- **Check:** Correct loading order in index.html
- **Check:** No JavaScript errors in console (F12)

## 💡 Tips & Tricks

1. **Start Simple** - Create one room with basic hotspots first
2. **Use Grid** - Enable grid overlay for precise placement
3. **Zoom In** - Use zoom controls (50%, 100%, 200%, 400%)
4. **Name Everything** - Clear names make organization easier
5. **Test Often** - Switch to Select tool to test interactions
6. **Save Frequently** - Auto-saves to localStorage, but export JSON for backup
7. **Layer Order** - Remember: Background → Walk Areas → Objects → Characters → Hotspots

## 🎓 Learning Path

### Beginner (Day 1)
1. Run locally with Python server
2. Create your first room
3. Add a walk area and hotspot
4. Place objects and characters

### Intermediate (Week 1)
1. Create multi-room game
2. Master all 7 tools
3. Configure complex hotspot interactions
4. Deploy to Netlify/Vercel

### Advanced (Month 1)
1. Study ARCHITECTURE.md
2. Extend modules with custom features
3. Add new object types to library
4. Build with Vite for optimization
5. Create Electron desktop version

## 🤝 Getting Help

### Resources
- **README.md** - Features and basic usage
- **ARCHITECTURE.md** - Module system and technical details
- **DEPLOYMENT.md** - Hosting and distribution

### Common Questions

**Q: Can I add more object types?**
A: Yes! Edit object-module.js, add to `defaultLibrary` array

**Q: How do I create custom characters?**
A: Edit character-module.js, add new templates with sprite emoji

**Q: Can I change the canvas size?**
A: Yes, but 320×200 is the retro standard. Edit core.js if needed

**Q: Where is game data stored?**
A: In browser's localStorage. Export to JSON for backup/sharing

**Q: Can I use my own emoji sprites?**
A: Yes! Change the `sprite` property to any emoji

## ✨ You're Ready!

Everything is set up and ready to go. Just run the server and start creating!

```bash
# Start creating now:
python3 -m http.server 8000

# Then visit:
# http://localhost:8000
```

**Have fun building retro adventure games! 🎮**

---

*Built with vanilla JavaScript - no dependencies required!*
