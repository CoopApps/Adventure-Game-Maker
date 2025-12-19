# RetroQuest Game Builder - Architecture Documentation

## System Overview

RetroQuest Game Builder is a browser-based application built with vanilla JavaScript using a modular architecture pattern. The system is designed for creating point-and-click adventure games with a retro aesthetic.

### Core Principles

1. **Zero Dependencies** - Pure vanilla JavaScript, no frameworks or libraries
2. **Modular Design** - Each feature is a self-contained module
3. **Event-Driven** - Core system delegates events to active modules
4. **Canvas-Based** - All rendering happens on HTML5 Canvas (320x200 pixels)
5. **Persistent Storage** - LocalStorage for game data persistence

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  (index.html - DOM structure, CSS styling, event listeners) │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Core System Layer                       │
│        (core.js - Module registry, event routing,           │
│         rendering pipeline, state management)                │
└─────┬─────┬─────┬─────┬─────┬─────┬─────┬────────────────┘
      │     │     │     │     │     │     │
┌─────▼─┐ ┌─▼───┐ ┌─▼─┐ ┌─▼──┐ ┌──▼┐ ┌──▼┐ ┌─▼────┐
│Select │ │Room │ │Hot│ │Walk│ │Obj│ │Char│ │Test  │
│Module │ │Mod. │ │Mod│ │Mod │ │Mod│ │Mod │ │Module│
└───────┘ └─────┘ └───┘ └────┘ └───┘ └────┘ └──────┘
                  Module Layer
                  (Tool-specific functionality)
```

## Module Communication Pattern

### Registration Phase

```javascript
// Module defines its interface
class MyModule {
    initialize(core) {
        this.core = core;  // Store reference to core
        // Setup module-specific state
    }
}

// Module registers with core
RetroQuest.registerModule('mymodule', new MyModule());
```

### Runtime Communication

```javascript
// User clicks on canvas
Canvas Element → MouseEvent
    ↓
Core.handleCanvasClick(event)
    ↓
Get active tool from state (e.g., 'hotspot')
    ↓
Delegate to module: modules['hotspot'].handleMouseDown(event)
    ↓
Module processes event and updates its state
    ↓
Module calls core.render() to trigger re-render
    ↓
Core executes rendering pipeline
    ↓
Each module's render() method is called in sequence
```

## Data Flow

### State Management

```
┌──────────────────────────────────────────────────────────┐
│                    Core State                            │
│  - currentTool: string                                   │
│  - selectedRoom: string                                  │
│  - isInitialized: boolean                                │
│  - zoom: number                                          │
│  - showGrid: boolean                                     │
└──────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│  Room Data   │  │ Module Data │  │   Canvas   │
│              │  │             │  │   State    │
│ - rooms: []  │  │ Each module │  │ - ctx      │
│ - backgrounds│  │ maintains   │  │ - canvas   │
│ - metadata   │  │ own data    │  │ - coords   │
└──────┬───────┘  └──────┬──────┘  └────────────┘
       │                 │
       └────────┬────────┘
                │
       ┌────────▼─────────┐
       │   LocalStorage   │
       │  (Persistence)   │
       └──────────────────┘
```

### Data Persistence Strategy

Each module is responsible for:
1. Maintaining its own runtime state
2. Serializing data when needed
3. Persisting to localStorage
4. Loading from localStorage on initialization

**Current Implementation:**
- Character data: `localStorage` keyed by room
- Room data: Core system manages room list
- Hotspot data: Per-room storage
- Walk area data: Per-room storage
- Object data: Global library + per-room placements

## Rendering Pipeline

### Layer Order (Z-index equivalent)

```
Layer 7: Temporary UI (drawing guides, selection highlights)
Layer 6: Hotspots (interactive areas - semi-transparent)
Layer 5: Characters (movable NPCs/player)
Layer 4: Objects (items, furniture)
Layer 3: Walk Areas (movement zones - when visible)
Layer 2: Grid (when enabled)
Layer 1: Background Image
Layer 0: Canvas clear (blank slate)
```

### Render Sequence

```javascript
render() {
    // 0. Clear canvas
    ctx.clearRect(0, 0, 320, 200);

    // 1. Background (room module)
    renderBackground();

    // 2. Grid (if enabled)
    if (state.showGrid) renderGrid();

    // 3. Walk areas (walkarea module)
    renderWalkAreas();

    // 4. Objects (object module)
    renderObjects();

    // 5. Characters (character module)
    renderCharacters();

    // 6. Hotspots (hotspot module)
    renderHotspots();

    // 7. Active tool overlays
    modules[currentTool].render(ctx);
}
```

## Module Interfaces

### Required Methods

Every module must implement:

```javascript
class ToolModule {
    // Called once during initialization
    initialize(core) { }

    // Called every frame
    render(ctx) { }

    // Mouse event handlers
    handleMouseDown(event) { }
    handleMouseMove(event) { }
    handleMouseUp(event) { }

    // Called when tool is selected
    onToolSelect() { }

    // Called when tool is deselected
    onToolDeselect() { }
}
```

### Optional Methods

```javascript
class ToolModule {
    // Keyboard events
    handleKeyDown(event) { }
    handleKeyUp(event) { }

    // Context menu
    handleContextMenu(event) { }

    // Utility methods
    updateProperties(element) { }
    deleteElement(element) { }

    // Data management
    saveToLocalStorage() { }
    loadFromLocalStorage() { }
}
```

## Coordinate Systems

### Canvas Coordinates

```
(0,0) ─────────────────────────► X (319)
  │
  │     Retro Canvas
  │     320 × 200 pixels
  │
  │
  ▼
  Y
(199)
```

### Mouse Event Translation

```javascript
// Browser gives us viewport coordinates
event.clientX, event.clientY
    ↓
// Subtract canvas position
canvas.getBoundingClientRect()
    ↓
// Account for zoom level
coordinates / zoom
    ↓
// Canvas coordinates (0-319, 0-199)
canvasX, canvasY
```

This is handled by `core.getCanvasCoordinates(event)`.

## Module Descriptions

### Core System (`core.js`)

**Responsibilities:**
- Module registry and initialization
- Event delegation to active tool
- Rendering pipeline orchestration
- Global state management
- Canvas setup and management
- Utility functions (geometry, coordinates)

**Key APIs:**
- `registerModule(name, instance)` - Register a tool module
- `render()` - Trigger full canvas re-render
- `getCanvasCoordinates(event)` - Convert mouse events to canvas coords
- `updateStatus(message)` - Update status bar text
- `pointInPolygon(point, polygon)` - Geometry utility
- `getDistance(p1, p2)` - Calculate distance between points

### Select Module (`select-module.js`)

**Purpose:** Universal element selection and manipulation

**Capabilities:**
- Detect elements at cursor position (all types)
- Drag-and-drop repositioning
- Delete via keyboard (Delete key)
- Show properties panel
- Room overview with element statistics

**Priority Order:**
1. Characters (highest priority)
2. Objects
3. Hotspots
4. Walk Areas (lowest priority)

### Room Module (`room-module.js`)

**Purpose:** Scene/room management

**Capabilities:**
- Create/delete/duplicate rooms
- Upload background images (auto-resize to 320×200)
- Switch between rooms
- Room metadata (name, description)
- Background image caching (prevent flicker)

**Data Structure:**
```javascript
{
    id: 'room-uuid',
    name: 'Starting Room',
    backgroundImageData: 'data:image/png;base64,...',
    cachedImage: Image(),  // Cached for performance
    hotspots: [],
    objects: [],
    characters: [],
    walkAreas: []
}
```

### Hotspot Module (`hotspot-module.js`)

**Purpose:** Interactive area creation

**Capabilities:**
- Freehand path drawing
- Auto-close detection
- 8-color visual palette
- Customizable responses (look, use, talk, take)
- Action configuration (examine, teleport, etc.)

**Drawing Algorithm:**
- Tracks mouse movement
- Adds points when distance > threshold
- Detects proximity to start point for auto-close
- Minimum distance between points to avoid clutter

**Data Structure:**
```javascript
{
    id: 'hotspot-uuid',
    name: 'Door',
    polygon: [{x, y}, ...],
    color: '#ff0000',
    responses: {
        look: 'A wooden door',
        use: 'The door is locked',
        talk: 'The door doesn\'t respond',
        take: 'You can\'t take the door'
    },
    action: 'examine'
}
```

### Walk Area Module (`walkarea-module.js`)

**Purpose:** Character movement zones

**Capabilities:**
- Click-to-add polygon creation
- Minimum 3-point validation
- Auto-close when clicking near start
- Right-click or double-click to finish
- Walkable vs walk-behind types
- Enable/disable individual areas

**Drawing Method:**
- Click to add vertices
- Visual preview line to cursor
- Distance check for auto-close
- Minimum spacing between points

**Data Structure:**
```javascript
{
    id: 'walkarea-uuid',
    name: 'Main Floor',
    polygon: [{x, y}, ...],
    type: 'walkable',  // or 'walkbehind'
    enabled: true
}
```

### Object Module (`object-module.js`)

**Purpose:** Object library and placement

**Capabilities:**
- Pre-built library (10 default objects)
- Category organization
- Drag from library to canvas
- Hotspot linking
- Custom object creation
- Takeable/combinable properties

**Object Categories:**
- Items (key, coin, book)
- Interactive (door, switch, lamp)
- Containers (chest)
- Weapons (sword, shield, potion)

**Data Structure:**
```javascript
{
    id: 'object-uuid',
    name: 'Key',
    description: 'A rusty metal key',
    sprite: '🗝️',
    position: {x, y},
    takeable: true,
    combinable: true,
    category: 'Items',
    linkedHotspot: 'hotspot-uuid'  // Optional
}
```

### Character Module (`character-module.js`)

**Purpose:** Character creation and management

**Capabilities:**
- 6 character templates
- Drag-and-drop placement
- Position tracking per room
- Customizable properties (name, walk speed, animations)
- Visual emoji-based sprites

**Character Templates:**
1. Hero (🧙‍♂️) - walkSpeed: 120, runSpeed: 200
2. Heroine (🧝‍♀️) - walkSpeed: 120, runSpeed: 200
3. Child (👦) - walkSpeed: 100, runSpeed: 160
4. Elder (🧙) - walkSpeed: 80, runSpeed: 120
5. Merchant (🧑‍💼) - walkSpeed: 100, runSpeed: 150
6. Guard (💂) - walkSpeed: 110, runSpeed: 180

**Data Structure:**
```javascript
{
    id: 'char-uuid',
    name: 'Hero',
    type: 'hero',
    sprite: '🧙‍♂️',
    position: {x, y},
    walkSpeed: 120,
    runSpeed: 200,
    frameRate: 8,
    color: '#4a90e2',
    frames: 4
}
```

## Design Patterns Used

### 1. Module Pattern

Each tool is encapsulated in a module with private state and public interface.

### 2. Registry Pattern

Core system maintains a registry of all modules and delegates to them.

### 3. Observer Pattern (Implicit)

Modules call `core.render()` to notify the system of state changes.

### 4. Strategy Pattern

Different tools implement the same interface but with different behaviors.

### 5. Singleton Pattern

The `RetroQuest` object is a singleton managing the entire application.

## Extensibility

### Adding a New Tool

1. **Create module file** (`newtool-module.js`):

```javascript
class NewToolModule {
    initialize(core) {
        this.core = core;
        this.state = {};
    }

    handleMouseDown(e) {
        const coords = this.core.getCanvasCoordinates(e);
        // Your logic
        this.core.render();
    }

    render(ctx) {
        // Draw your tool's visuals
    }
}

RetroQuest.registerModule('newtool', new NewToolModule());
```

2. **Add to index.html**:

```html
<script src="newtool-module.js"></script>
<button data-tool="newtool">New Tool</button>
```

3. **Register tool**:
The module self-registers via `RetroQuest.registerModule()`.

### Adding New Features to Existing Modules

Modules are self-contained, so you can:
- Add new methods without affecting other modules
- Extend data structures
- Add new UI elements in the properties panel
- Implement new rendering effects

## Performance Considerations

### Current Optimizations

1. **Image Caching** - Background images are cached to prevent re-loading
2. **Pixel Art Mode** - `imageSmoothingEnabled = false` for crisp rendering
3. **Selective Rendering** - Only render when state changes
4. **LocalStorage** - Fast client-side persistence

### Potential Optimizations

1. **Layer Caching** - Cache static layers (background, grid) to offscreen canvas
2. **Dirty Region Tracking** - Only re-render changed areas
3. **Object Pooling** - Reuse polygon/coordinate objects
4. **Throttling** - Limit mouse move event frequency
5. **Web Workers** - Move complex calculations off main thread

## Testing Strategy

### Current State
No automated tests implemented.

### Recommended Testing Approach

1. **Unit Tests** - Test individual module methods
2. **Integration Tests** - Test module interactions via core system
3. **E2E Tests** - Simulate user workflows (create room, add hotspot, etc.)
4. **Visual Regression** - Screenshot comparison for rendering
5. **Performance Tests** - Measure render time, memory usage

### Test Framework Recommendations

- **Jest** - Unit and integration tests
- **Playwright** - E2E browser testing
- **Puppeteer** - Screenshot comparison
- **Lighthouse** - Performance metrics

## Deployment Architectures

### Option 1: Static Web App (Simplest)

**Structure:**
```
RetroQuest/
├── index.html
├── core.js
├── select-module.js
├── room-module.js
├── hotspot-module.js
├── walkarea-module.js
├── object-module.js
├── character-module.js
└── test-game-module.js
```

**Deployment:**
- GitHub Pages
- Netlify
- Vercel
- Any static host

**Pros:** Zero configuration, instant deployment
**Cons:** No build optimization, no bundling

### Option 2: Modern Build Tools

**Structure:**
```
RetroQuest/
├── src/
│   ├── main.js
│   ├── core/
│   │   └── core.js
│   └── modules/
│       ├── select.js
│       ├── room.js
│       ├── hotspot.js
│       ├── walkarea.js
│       ├── object.js
│       └── character.js
├── public/
│   └── index.html
├── dist/ (generated)
├── package.json
└── vite.config.js
```

**Build Tools:**
- **Vite** (recommended) - Fast, modern, zero-config
- Webpack - More control, steeper learning curve
- Rollup - Library-focused bundler

**Benefits:**
- Module bundling (single JS file)
- Code minification
- Tree shaking (remove unused code)
- Dev server with hot reload
- CSS preprocessing

**Setup Example (Vite):**
```json
{
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

### Option 3: Progressive Web App (PWA)

**Additional Files:**
```
RetroQuest/
├── (all existing files)
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

**manifest.json:**
```json
{
  "name": "RetroQuest Game Builder",
  "short_name": "RetroQuest",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e1e1e",
  "theme_color": "#007acc",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Benefits:**
- Installable on desktop/mobile
- Offline support
- App-like experience
- No browser UI

### Option 4: Electron Desktop App

**Structure:**
```
RetroQuest/
├── main.js (Electron main process)
├── preload.js (Bridge script)
├── renderer/
│   ├── index.html
│   └── (all existing JS files)
├── package.json
└── build/
    └── icon.png
```

**package.json:**
```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}
```

**Benefits:**
- True desktop application
- File system access (save/load projects)
- Native menus and dialogs
- No browser restrictions
- Cross-platform (Windows, Mac, Linux)

**Drawbacks:**
- Larger download size (~100MB)
- More complex build process
- Need to manage updates

### Option 5: Hybrid (Recommended)

**Best of both worlds:**
- Core web app (static hosting or build tools)
- Electron wrapper for desktop
- PWA manifest for mobile

**Project Structure:**
```
RetroQuest/
├── src/ (shared source code)
├── web/ (web build output)
├── electron/ (Electron-specific files)
├── package.json
└── build-scripts/
    ├── build-web.js
    ├── build-electron.js
    └── build-pwa.js
```

## Recommended Next Steps

### Immediate (MVP Complete)

1. ✅ **All core modules implemented**
2. ✅ **README documentation**
3. 🔲 **Test in browser** - Verify all functionality works
4. 🔲 **Fix any bugs** - Address issues found during testing

### Short-term (Enhanced MVP)

5. 🔲 **Test game module** - Implement game preview functionality
6. 🔲 **Save/Load** - Project export/import to JSON
7. 🔲 **Choose deployment** - Pick one of the 5 options above
8. 🔲 **Deploy v1.0** - Get it online

### Medium-term (Feature Complete)

9. 🔲 **Animation editor** - Frame-based sprite animation
10. 🔲 **Dialogue system** - Conversation trees
11. 🔲 **Inventory system** - Item management
12. 🔲 **Export playable game** - Generate standalone game file

### Long-term (Polish & Scale)

13. 🔲 **Sound/music** - Audio integration
14. 🔲 **Multiplayer** - Collaborative editing
15. 🔲 **Asset marketplace** - Share objects/characters
16. 🔲 **Scripting system** - Custom game logic

## Security Considerations

### Current Implementation

**Low Risk Areas:**
- No server-side code
- No user authentication
- No database
- All data client-side

**Potential Risks:**
1. **XSS via LocalStorage** - If user input isn't sanitized
2. **File Upload** - Background images could contain malicious data
3. **Export/Import** - JSON parsing could be exploited

### Recommended Security Measures

```javascript
// 1. Sanitize user input
function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 2. Validate file uploads
function validateImageUpload(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type');
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File too large');
    }
}

// 3. Validate JSON imports
function validateGameData(data) {
    // Check required fields
    // Validate data types
    // Sanitize strings
    return data;
}
```

## Conclusion

RetroQuest Game Builder follows a clean, modular architecture that enables:
- Easy feature addition
- Independent module development
- Clear separation of concerns
- Minimal dependencies
- Multiple deployment options

The current codebase is production-ready for deployment as a static web app, with clear paths to enhance it with build tools, PWA features, or Electron packaging based on project requirements.
