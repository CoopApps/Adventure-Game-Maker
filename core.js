/**
 * RetroQuest Game Builder - Core System
 * Manages modules, canvas rendering, and global state
 */

window.RetroQuest = {
    // Core properties
    canvas: null,
    ctx: null,
    currentTool: 'select',
    zoomLevel: 1,
    showGrid: false,

    // Module registry
    modules: {},

    // Global state
    state: {
        currentRoomId: 1,
        isInitialized: false,
        renderLayers: ['background', 'walkarea', 'object', 'character', 'hotspot']
    },

    /**
     * Initialize the core system and all modules
     */
    initialize() {
        console.log('🎯 RetroQuest Core: Initializing...');

        try {
            // Get canvas elements
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');

            if (!this.canvas || !this.ctx) {
                throw new Error('Canvas or context not found');
            }

            // Configure canvas for pixel art
            this.setupCanvas();

            // Setup global event listeners
            this.setupEventListeners();

            // Initialize all registered modules
            this.initializeModules();

            // Initial render
            this.render();

            // Update UI
            this.updateStatus('RetroQuest Game Builder ready');
            this.state.isInitialized = true;

            // Hide loading screen and show app
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('app').style.display = 'flex';

            console.log('✅ RetroQuest Core: Initialization complete');

        } catch (error) {
            console.error('❌ RetroQuest Core: Initialization failed:', error);
            this.updateStatus('Initialization failed: ' + error.message);
        }
    },

    /**
     * Register a module with the core system
     */
    registerModule(name, moduleInstance) {
        console.log(`📦 Registering module: ${name}`);
        this.modules[name] = moduleInstance;

        // Initialize module if core is already initialized
        if (this.state.isInitialized) {
            this.initializeModule(name, moduleInstance);
        }
    },

    /**
     * Initialize a specific module
     */
    initializeModule(name, moduleInstance) {
        try {
            if (typeof moduleInstance.initialize === 'function') {
                moduleInstance.initialize(this);
                console.log(`✅ Module initialized: ${name}`);
            } else {
                console.warn(`⚠️ Module ${name} has no initialize method`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize module ${name}:`, error);
        }
    },

    /**
     * Initialize all registered modules
     */
    initializeModules() {
        console.log('🔧 Initializing all modules...');

        // Initialize in specific order to handle dependencies
        const initOrder = ['select', 'room', 'hotspot', 'walkarea', 'object', 'character'];

        initOrder.forEach(moduleName => {
            if (this.modules[moduleName]) {
                this.initializeModule(moduleName, this.modules[moduleName]);
            }
        });

        // Initialize any remaining modules
        Object.keys(this.modules).forEach(moduleName => {
            if (!initOrder.includes(moduleName)) {
                this.initializeModule(moduleName, this.modules[moduleName]);
            }
        });
    },

    /**
     * Setup canvas for pixel art rendering
     */
    setupCanvas() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        console.log('🎨 Canvas configured for pixel art rendering');
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Canvas events - bind to prevent context issues
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));

        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        console.log('🎮 Global event listeners attached');
    },

    /**
     * Handle mouse down events - direct delegation
     */
    onMouseDown(e) {
        if (!this.state.isInitialized) return;

        const module = this.getToolModule();
        if (module && typeof module.handleMouseDown === 'function') {
            module.handleMouseDown(e);
        }
    },

    /**
     * Handle mouse move events - direct delegation
     */
    onMouseMove(e) {
        if (!this.state.isInitialized) return;

        const module = this.getToolModule();
        if (module && typeof module.handleMouseMove === 'function') {
            module.handleMouseMove(e);
        }
    },

    /**
     * Handle mouse up events - direct delegation
     */
    onMouseUp(e) {
        if (!this.state.isInitialized) return;

        const module = this.getToolModule();
        if (module && typeof module.handleMouseUp === 'function') {
            module.handleMouseUp(e);
        }
    },

    /**
     * Handle double click events - direct delegation
     */
    onDoubleClick(e) {
        if (!this.state.isInitialized) return;

        const module = this.getToolModule();
        if (module && typeof module.handleDoubleClick === 'function') {
            module.handleDoubleClick(e);
        }
    },

    /**
     * Handle keyboard events
     */
    onKeyDown(e) {
        if (!this.state.isInitialized) return;

        // Global shortcuts
        if (e.key === 'Escape') {
            this.cancelAllOperations();
        }

        // Delegate to active module
        const module = this.getToolModule();
        if (module && typeof module.handleKeyDown === 'function') {
            module.handleKeyDown(e);
        }
    },

    /**
     * Cancel any ongoing operations in all modules
     */
    cancelAllOperations() {
        Object.values(this.modules).forEach(module => {
            if (typeof module.cancelOperation === 'function') {
                module.cancelOperation();
            }
        });
    },

    /**
     * Get the module for the current tool - NO RECURSION
     */
    getToolModule() {
        return this.modules[this.currentTool] || null;
    },

    /**
     * Select a tool and update UI
     */
    selectTool(toolName) {
        console.log(`🔧 Switching to tool: ${toolName}`);

        // Cancel any ongoing operations
        this.cancelAllOperations();

        // Update current tool
        const previousTool = this.currentTool;
        this.currentTool = toolName;

        // Update button states
        document.querySelectorAll('.tool-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === toolName);
        });

        // Notify modules of tool change
        Object.values(this.modules).forEach(module => {
            if (typeof module.onToolChanged === 'function') {
                module.onToolChanged(toolName, previousTool);
            }
        });

        // Update cursor and status
        this.updateCursor();
        this.updateStatus(`${toolName.charAt(0).toUpperCase() + toolName.slice(1)} tool selected`);

        // Update properties panel
        this.updateProperties();

        // Re-render to update tool-specific overlays
        this.render();
    },

    /**
     * Update cursor based on current tool
     */
    updateCursor() {
        const cursors = {
            select: 'default',
            room: 'default',
            hotspot: 'crosshair',
            walkarea: 'crosshair',
            object: 'default',
            character: 'crosshair'
        };

        this.canvas.style.cursor = cursors[this.currentTool] || 'default';
    },

    /**
     * Update properties panel - NO RECURSION
     */
    updateProperties() {
        const module = this.getToolModule();
        if (module && typeof module.updatePropertiesPanel === 'function') {
            module.updatePropertiesPanel();
        } else {
            this.showDefaultProperties();
        }
    },

    /**
     * Show default properties panel
     */
    showDefaultProperties() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (propertiesTitle) {
            propertiesTitle.textContent = this.currentTool.toUpperCase() + ' TOOL';
        }

        if (propertiesContent) {
            propertiesContent.innerHTML = `
                <div class="no-selection">
                    <p>Select elements to edit properties</p>
                </div>
            `;
        }
    },

    /**
     * Main render function - renders all layers in order
     */
    render() {
        if (!this.ctx) return;

        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, 320, 200);

            // Render each layer in order - NO RECURSION
            this.renderBackground();
            this.renderGrid();
            this.renderWalkAreas();
            this.renderObjects();
            this.renderCharacters();
            this.renderHotspots();

        } catch (error) {
            console.error('❌ Render error:', error);
        }
    },

    /**
     * Render background and room elements
     */
    renderBackground() {
        if (this.modules.room && typeof this.modules.room.renderBackground === 'function') {
            this.modules.room.renderBackground();
        } else {
            // Default background
            this.ctx.fillStyle = '#2a2a2a';
            this.ctx.fillRect(0, 0, 320, 200);
        }
    },

    /**
     * Render grid overlay
     */
    renderGrid() {
        if (!this.showGrid) return;

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([1, 1]);

        // Vertical lines
        for (let x = 0; x <= 320; x += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 0.5, 0);
            this.ctx.lineTo(x - 0.5, 200);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= 200; y += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y - 0.5);
            this.ctx.lineTo(320, y - 0.5);
            this.ctx.stroke();
        }

        this.ctx.restore();
    },

    /**
     * Render walk areas
     */
    renderWalkAreas() {
        if (this.modules.walkarea &&
            (document.getElementById('showWalkAreas')?.checked || this.currentTool === 'walkarea') &&
            typeof this.modules.walkarea.render === 'function') {
            this.modules.walkarea.render(this.ctx);
        }
    },

    /**
     * Render objects
     */
    renderObjects() {
        if (this.modules.object &&
            (document.getElementById('showObjects')?.checked || this.currentTool === 'object') &&
            typeof this.modules.object.render === 'function') {
            this.modules.object.render(this.ctx);
        }
    },

    /**
     * Render characters
     */
    renderCharacters() {
        if (this.modules.character &&
            (document.getElementById('showCharacters')?.checked || this.currentTool === 'character') &&
            typeof this.modules.character.render === 'function') {
            this.modules.character.render(this.ctx);
        }
    },

    /**
     * Render hotspots
     */
    renderHotspots() {
        if (this.modules.hotspot &&
            (document.getElementById('showHotspots')?.checked || this.currentTool === 'hotspot') &&
            typeof this.modules.hotspot.render === 'function') {
            this.modules.hotspot.render(this.ctx);
        }
    },

    /**
     * Get canvas coordinates from mouse event
     */
    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.zoomLevel);
        const y = Math.floor((e.clientY - rect.top) / this.zoomLevel);

        return {
            x: Math.max(0, Math.min(319, x)),
            y: Math.max(0, Math.min(199, y))
        };
    },

    /**
     * Update status bar
     */
    updateStatus(message) {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = message;
        }
    },

    /**
     * Set zoom level
     */
    setZoom(level) {
        this.zoomLevel = parseFloat(level);
        this.canvas.style.width = (320 * this.zoomLevel) + 'px';
        this.canvas.style.height = (200 * this.zoomLevel) + 'px';
        this.updateStatus(`Zoom: ${Math.round(this.zoomLevel * 100)}%`);
    },

    /**
     * Toggle grid visibility
     */
    toggleGrid() {
        this.showGrid = document.getElementById('showGrid').checked;
        this.render();
    },

    /**
     * Toggle hotspot visibility
     */
    toggleHotspots() {
        this.render();
    },

    /**
     * Toggle walk area visibility
     */
    toggleWalkAreas() {
        this.render();
    },

    /**
     * Toggle object visibility
     */
    toggleObjects() {
        this.render();
    },

    /**
     * Toggle character visibility
     */
    toggleCharacters() {
        this.render();
    },

    /**
     * Handle file menu
     */
    showFileMenu(event) {
        // TODO: Implement file menu
        console.log('File menu clicked');
    },

    /**
     * Test game functionality
     */
    testGame() {
        console.log('🎮 Testing game...');
        this.updateStatus('Game test functionality coming soon...');
    },

    /**
     * Handle canvas drag over for file drops
     */
    handleCanvasDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        // Visual feedback
        const container = event.currentTarget;
        container.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
        container.style.border = '2px dashed #007acc';
    },

    /**
     * Handle canvas drag leave
     */
    handleCanvasDragLeave(event) {
        const container = event.currentTarget;
        container.style.backgroundColor = '';
        container.style.border = '';
    },

    /**
     * Handle canvas drop for files and objects
     */
    handleCanvasDrop(event) {
        event.preventDefault();

        // Clear visual feedback
        const container = event.currentTarget;
        container.style.backgroundColor = '';
        container.style.border = '';

        // Get canvas coordinates
        const coords = this.getCanvasCoordinates(event);

        // Check for character drops first
        if (this.modules.character && typeof this.modules.character.handleCanvasDrop === 'function') {
            const handled = this.modules.character.handleCanvasDrop(event, coords.x, coords.y);
            if (handled) return;
        }

        // Check for file drops (background images)
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') && this.modules.room) {
                this.modules.room.handleImageDrop(file);
                return;
            }
        }

        // Check for object drops
        const objectData = event.dataTransfer.getData('application/json');
        if (objectData && this.modules.object) {
            try {
                const data = JSON.parse(objectData);
                this.modules.object.handleObjectDrop(data, coords);
            } catch (error) {
                console.error('Error handling object drop:', error);
            }
        }
    },

    /**
     * Utility function to get distance between two points
     */
    getDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Utility function to check if point is in polygon
     */
    pointInPolygon(point, polygon) {
        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
                (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
                inside = !inside;
            }
        }

        return inside;
    }
};

console.log('🎯 RetroQuest Core: Loaded and ready for module registration');
