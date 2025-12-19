# RetroQuest Game Builder

A powerful, browser-based adventure game maker with a retro aesthetic. Create point-and-click adventure games with an intuitive visual editor!

## Features

### Core Functionality
- **Multi-Room Support** - Create and manage multiple game rooms/scenes
- **Background Images** - Upload and auto-resize images to 320x200 resolution
- **Modular Architecture** - Clean separation of concerns with independent modules

### Game Elements

#### Characters 🎭
- 6 character templates (Hero, Heroine, Child, Elder, Merchant, Guard)
- Drag-and-drop placement
- Customizable properties (name, walk speed, animations)
- Visual emoji-based sprites

#### Hotspots 🔥
- Freehand drawing of interactive areas
- 8-color palette for visual distinction
- Customizable interaction responses (look, use, talk, take)
- Action configuration (examine, teleport, etc.)
- Auto-close detection for easy polygon completion

#### Walk Areas 🚶
- Click-to-create polygon drawing
- Define walkable zones for character movement
- Walk-behind area support
- Visual preview while drawing
- Enable/disable individual areas

#### Objects 📦
- Pre-built library with 10 default items
- Category organization (Items, Interactive, Containers, Weapons)
- Drag-and-drop from library to canvas
- Hotspot linking for interactions
- Takeable/combinable properties

### Tools

- **Select Tool** - Universal element selection and manipulation
- **Room Tool** - Room management and background configuration
- **Hotspot Tool** - Draw interactive areas
- **Walk Area Tool** - Define character movement zones
- **Object Tool** - Place and configure objects
- **Character Tool** - Add and configure characters

### UI Features

- Dark VS Code-style interface
- Canvas-based editing with pixel-art rendering
- Zoom controls (50%, 100%, 200%, 400%)
- Grid overlay option
- Layer visibility toggles
- Properties panel for detailed editing
- Room overview with element statistics
- Right-click context menus
- Keyboard shortcuts (Delete, Escape)

## Getting Started

### Quick Start

1. **Open the game maker:**
   ```bash
   # Simply open index.html in a modern web browser
   open index.html
   ```

2. **Or use a local server:**
   ```bash
   # Python 3
   python -m http.server 8000

   # Then visit http://localhost:8000
   ```

### Creating Your First Game

1. **Set up the room:**
   - Click the Room tool
   - Upload a background image (or use the default)
   - Name your room

2. **Define walkable areas:**
   - Select the Walk Area tool
   - Click to add points (minimum 3)
   - Right-click or double-click to finish

3. **Add hotspots:**
   - Select the Hotspot tool
   - Drag to draw interactive areas
   - Configure responses in the properties panel

4. **Place objects:**
   - Select the Object tool
   - Drag items from the library to the canvas
   - Link objects to hotspots if desired

5. **Add characters:**
   - Select the Character tool
   - Choose a template or drag from the library
   - Position on canvas

## File Structure

```
Adventure-Game-Maker/
├── index.html              # Main application HTML
├── core.js                 # Core system and module manager
├── select-module.js        # Universal selection tool
├── room-module.js          # Room management
├── hotspot-module.js       # Interactive hotspots
├── walkarea-module.js      # Character movement zones
├── object-module.js        # Object library and placement
├── character-module.js     # Character management
└── test-game-module.js     # Game testing/preview (optional)
```

## Module System

The RetroQuest Game Builder uses a modular architecture where each feature is a self-contained module that registers with the core system.

### Module Registration

```javascript
class MyModule {
    initialize(core) {
        this.core = core;
        // Setup logic
    }

    handleMouseDown(e) { /* ... */ }
    handleMouseMove(e) { /* ... */ }
    render(ctx) { /* ... */ }
}

RetroQuest.registerModule('mymodule', new MyModule());
```

### Core API

- `core.render()` - Re-render the canvas
- `core.getCanvasCoordinates(event)` - Convert mouse event to canvas coords
- `core.updateStatus(message)` - Update status bar
- `core.pointInPolygon(point, polygon)` - Geometry utility

## Canvas Specifications

- **Resolution:** 320x200 pixels (retro gaming standard)
- **Rendering:** Pixel-art mode (no smoothing)
- **Coordinate System:** Top-left origin (0,0) to bottom-right (319, 199)
- **Background Images:** Auto-resized to 320x200

## Keyboard Shortcuts

- **Delete** - Delete selected element
- **Escape** - Cancel current operation
- **Right-click** - Context menu for elements

## Browser Compatibility

- ✅ Chrome/Edge (Chromium) - Recommended
- ✅ Firefox
- ✅ Safari
- ⚠️  Requires modern browser with ES6 support

## Deployment Options

### Option 1: Static Web Hosting
Host on GitHub Pages, Netlify, or Vercel for free web access.

### Option 2: Electron Desktop App
Package as a standalone desktop application for Windows, Mac, and Linux.

### Option 3: Progressive Web App (PWA)
Add service worker and manifest for installable web app experience.

## Development Status

**Current Version:** 1.0.0-beta

### Completed ✅
- Core module system
- All 7 game element modules
- Visual editor interface
- Room management
- Background image support
- Properties panels
- Context menus
- Drag-and-drop functionality

### Planned Features 🚧
- Game testing/preview mode
- Project save/load functionality
- Export to playable game
- Animation editor
- Dialogue system
- Inventory system
- Sound/music integration

## Technical Details

### Data Storage
Currently uses in-memory storage with localStorage for persistence. Game data is stored in JSON format.

### Rendering Pipeline
1. Clear canvas
2. Render background (room module)
3. Render grid (if enabled)
4. Render walk areas
5. Render objects
6. Render characters
7. Render hotspots

### Event Flow
```
User Input → Core System → Active Tool Module → Render Update
```

## Contributing

This is a modular system - new tools can be added by:
1. Creating a new module class
2. Implementing required methods (initialize, render, etc.)
3. Registering with `RetroQuest.registerModule()`

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Built with vanilla JavaScript - no dependencies required!

---

**Made with ❤️ for adventure game enthusiasts**
