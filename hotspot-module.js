/**
 * RetroQuest Game Builder - Hotspot Module
 * Handles creation and management of interactive hotspots
 */

class HotspotModule {
    constructor() {
        this.hotspots = [];
        this.selectedHotspot = null;
        this.hoveredHotspot = null;
        this.hotspotCounter = 0;
        this.core = null;

        // Drawing state
        this.isDrawing = false;
        this.currentPath = [];
        this.currentShape = 'freehand';
        this.startPoint = null;

        // Drawing settings
        this.minPathDistance = 3;
        this.autoCloseDistance = 10;
        this.minPointsForAutoClose = 8;

        // Hotspot color palette
        this.hotspotColors = [
            { fill: 'rgba(255, 107, 107, 0.4)', stroke: 'rgba(255, 107, 107, 0.8)', name: 'Red' },
            { fill: 'rgba(107, 255, 107, 0.4)', stroke: 'rgba(107, 255, 107, 0.8)', name: 'Green' },
            { fill: 'rgba(107, 107, 255, 0.4)', stroke: 'rgba(107, 107, 255, 0.8)', name: 'Blue' },
            { fill: 'rgba(255, 255, 107, 0.4)', stroke: 'rgba(255, 255, 107, 0.8)', name: 'Yellow' },
            { fill: 'rgba(255, 107, 255, 0.4)', stroke: 'rgba(255, 107, 255, 0.8)', name: 'Magenta' },
            { fill: 'rgba(107, 255, 255, 0.4)', stroke: 'rgba(107, 255, 255, 0.8)', name: 'Cyan' },
            { fill: 'rgba(255, 200, 107, 0.4)', stroke: 'rgba(255, 200, 107, 0.8)', name: 'Orange' },
            { fill: 'rgba(200, 107, 255, 0.4)', stroke: 'rgba(200, 107, 255, 0.8)', name: 'Purple' }
        ];
    }

    /**
     * Initialize the hotspot module
     */
    initialize(core) {
        console.log('🔥 Hotspot Module: Initializing...');
        this.core = core;

        try {
            this.setupUI();
            this.updateHotspotList();

            console.log('✅ Hotspot Module: Initialized successfully');
        } catch (error) {
            console.error('❌ Hotspot Module: Initialization failed:', error);
        }
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Hotspot list will be updated by updateHotspotList()
        // Properties panel will be updated by updatePropertiesPanel()
    }

    /**
     * Handle tool change notifications
     */
    onToolChanged(newTool, previousTool) {
        if (previousTool === 'hotspot') {
            this.cancelOperation();
        }

        if (newTool === 'hotspot') {
            this.updatePropertiesPanel();
            this.core.updateStatus('Hotspot tool active - drag to create interactive areas');
        }
    }

    /**
     * Cancel any ongoing operations
     */
    cancelOperation() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentPath = [];
            this.startPoint = null;
            this.core.render();
            this.core.updateStatus('Hotspot drawing cancelled');
        }
    }

    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        if (this.core.currentTool !== 'hotspot') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (e.button === 2) { // Right click
            const clickedHotspot = this.getHotspotAtPoint(coords);
            if (clickedHotspot) {
                this.showContextMenu(e, clickedHotspot);
            }
            return;
        }

        if (e.button === 0) { // Left click
            // Check if clicking on existing hotspot (just select, don't drag)
            const clickedHotspot = this.getHotspotAtPoint(coords);
            if (clickedHotspot && !this.isDrawing) {
                this.selectHotspot(clickedHotspot);
                return;
            }

            // Start drawing new hotspot if not clicking on existing one
            if (!clickedHotspot) {
                this.startDrawing(coords);
            }
        }
    }

    /**
     * Handle mouse move events
     */
    handleMouseMove(e) {
        if (this.core.currentTool !== 'hotspot') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (this.isDrawing) {
            this.continueDrawing(coords);
        } else {
            this.updateHover(coords);
        }
    }

    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        if (this.core.currentTool !== 'hotspot') return;

        if (this.isDrawing && e.button === 0) {
            this.finishDrawing();
        }
    }

    /**
     * Handle double click events
     */
    handleDoubleClick(e) {
        // For polygon mode if we implement it
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(e) {
        if (this.core.currentTool !== 'hotspot') return;

        if (e.key === 'Escape' && this.isDrawing) {
            this.cancelOperation();
        } else if (e.key === 'Delete' && this.selectedHotspot) {
            this.deleteHotspot(this.selectedHotspot);
        }
    }

    /**
     * Start drawing a new hotspot
     */
    startDrawing(startPoint) {
        this.isDrawing = true;
        this.startPoint = startPoint;
        this.currentPath = [startPoint];

        this.core.canvas.style.cursor = 'crosshair';
        this.core.updateStatus('Drawing hotspot... (release mouse to finish)');
    }

    /**
     * Continue drawing the hotspot path
     */
    continueDrawing(currentPoint) {
        if (!this.isDrawing || this.currentPath.length === 0) return;

        const lastPoint = this.currentPath[this.currentPath.length - 1];
        const distance = this.core.getDistance(lastPoint, currentPoint);

        if (distance >= this.minPathDistance) {
            this.currentPath.push(currentPoint);

            // Check for auto-close
            if (this.currentPath.length > this.minPointsForAutoClose) {
                const distanceToStart = this.core.getDistance(currentPoint, this.startPoint);
                if (distanceToStart <= this.autoCloseDistance) {
                    this.finishDrawing();
                    return;
                }
            }

            // Re-render with current path
            this.core.render();
        }
    }

    /**
     * Finish drawing the hotspot
     */
    finishDrawing() {
        if (!this.isDrawing || this.currentPath.length < 3) {
            this.cancelOperation();
            return;
        }

        const hotspot = this.createHotspotFromPath(this.currentPath);
        this.hotspots.push(hotspot);

        this.isDrawing = false;
        this.currentPath = [];
        this.startPoint = null;
        this.core.canvas.style.cursor = 'crosshair';

        this.core.render();
        this.updateHotspotList();
        this.selectHotspot(hotspot);

        this.core.updateStatus(`Created hotspot: ${hotspot.name}`);
    }

    /**
     * Create a hotspot object from a drawn path
     */
    createHotspotFromPath(path) {
        const bounds = this.calculateBounds(path);
        const colorIndex = this.hotspotCounter % this.hotspotColors.length;
        const color = this.hotspotColors[colorIndex];

        const hotspot = {
            id: `hotspot_${Date.now()}_${this.hotspotCounter}`,
            name: `${color.name} Hotspot ${this.hotspotCounter + 1}`,
            shape: 'freehand',
            path: [...path],
            bounds: bounds,
            fillColor: color.fill,
            strokeColor: color.stroke,
            enabled: true,
            visible: true,
            created: new Date().toISOString(),

            // Interaction responses
            responses: {
                look: 'You see something interesting here.',
                use: 'You can\'t use that.',
                talk: 'There\'s nothing to talk to.',
                take: 'You can\'t take that.'
            },

            // Advanced actions
            actions: {
                onClick: 'examine',
                onUse: null,
                onTalk: null,
                targetRoom: null,
                entryPoint: { x: 160, y: 100 }
            },

            // Conditions
            conditions: {
                requiredItem: null,
                requiredFlag: null,
                visibleWhen: null
            }
        };

        this.hotspotCounter++;
        return hotspot;
    }

    /**
     * Calculate bounding box for a path
     */
    calculateBounds(path) {
        if (path.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

        let minX = path[0].x, maxX = path[0].x;
        let minY = path[0].y, maxY = path[0].y;

        for (const point of path) {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * Render all hotspots
     */
    render() {
        // Draw existing hotspots
        this.hotspots.forEach((hotspot, index) => {
            if (hotspot.visible) {
                this.drawHotspot(hotspot, index);
            }
        });

        // Draw current path if drawing
        if (this.isDrawing && this.currentPath.length > 0) {
            this.drawCurrentPath();
        }
    }

    /**
     * Draw a single hotspot
     */
    drawHotspot(hotspot, index) {
        if (!hotspot.path || hotspot.path.length < 2) return;

        const isSelected = this.selectedHotspot === hotspot;
        const isHovered = this.hoveredHotspot === hotspot;

        this.core.ctx.save();

        // Set colors and line width
        this.core.ctx.fillStyle = hotspot.fillColor;
        this.core.ctx.strokeStyle = hotspot.strokeColor;
        this.core.ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);

        // Draw the hotspot shape
        this.core.ctx.beginPath();
        this.core.ctx.moveTo(hotspot.path[0].x, hotspot.path[0].y);

        for (let i = 1; i < hotspot.path.length; i++) {
            this.core.ctx.lineTo(hotspot.path[i].x, hotspot.path[i].y);
        }

        this.core.ctx.closePath();
        this.core.ctx.fill();
        this.core.ctx.stroke();

        // Draw hotspot label
        const center = this.getPathCenter(hotspot.path);
        this.drawHotspotLabel(hotspot, center, index + 1);

        this.core.ctx.restore();
    }

    /**
     * Draw the current path while drawing
     */
    drawCurrentPath() {
        if (!this.isDrawing || this.currentPath.length < 2) return;

        const colorIndex = this.hotspotCounter % this.hotspotColors.length;
        const color = this.hotspotColors[colorIndex];

        this.core.ctx.save();
        this.core.ctx.strokeStyle = color.stroke;
        this.core.ctx.fillStyle = color.fill;
        this.core.ctx.lineWidth = 2;
        this.core.ctx.setLineDash([5, 3]);

        this.core.ctx.beginPath();
        this.core.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);

        for (let i = 1; i < this.currentPath.length; i++) {
            this.core.ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
        }

        this.core.ctx.stroke();
        this.core.ctx.setLineDash([]);

        // Draw points
        this.core.ctx.fillStyle = color.stroke;
        for (const point of this.currentPath) {
            this.core.ctx.beginPath();
            this.core.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.core.ctx.fill();
        }

        // Show start point differently
        if (this.currentPath.length > 0) {
            this.core.ctx.fillStyle = '#ffffff';
            this.core.ctx.strokeStyle = color.stroke;
            this.core.ctx.lineWidth = 2;
            this.core.ctx.beginPath();
            this.core.ctx.arc(this.currentPath[0].x, this.currentPath[0].y, 4, 0, Math.PI * 2);
            this.core.ctx.fill();
            this.core.ctx.stroke();
        }

        this.core.ctx.restore();
    }

    /**
     * Draw hotspot label with number
     */
    drawHotspotLabel(hotspot, center, number) {
        this.core.ctx.save();

        // Background for number
        this.core.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.core.ctx.fillRect(center.x - 12, center.y - 8, 24, 16);

        // Number text
        this.core.ctx.fillStyle = '#ffffff';
        this.core.ctx.font = 'bold 12px monospace';
        this.core.ctx.textAlign = 'center';
        this.core.ctx.textBaseline = 'middle';
        this.core.ctx.fillText(number.toString(), center.x, center.y);

        this.core.ctx.restore();
    }

    /**
     * Get center point of a path
     */
    getPathCenter(path) {
        let centerX = 0, centerY = 0;

        for (const point of path) {
            centerX += point.x;
            centerY += point.y;
        }

        return {
            x: centerX / path.length,
            y: centerY / path.length
        };
    }

    /**
     * Check if a point is inside a hotspot
     */
    isPointInHotspot(point, hotspot) {
        if (!hotspot.path || hotspot.path.length < 3) return false;
        return this.core.pointInPolygon(point, hotspot.path);
    }

    /**
     * Get hotspot at a specific point
     */
    getHotspotAtPoint(point) {
        // Check hotspots in reverse order (top hotspot first)
        for (let i = this.hotspots.length - 1; i >= 0; i--) {
            const hotspot = this.hotspots[i];
            if (this.isPointInHotspot(point, hotspot)) {
                return hotspot;
            }
        }
        return null;
    }

    /**
     * Update hover state
     */
    updateHover(point) {
        const hoveredHotspot = this.getHotspotAtPoint(point);

        if (hoveredHotspot !== this.hoveredHotspot) {
            this.hoveredHotspot = hoveredHotspot;
            this.core.render();

            if (hoveredHotspot) {
                this.core.canvas.style.cursor = 'pointer';
                this.core.updateStatus(`Hotspot: ${hoveredHotspot.name} (click to select, right-click for menu)`);
            } else {
                this.core.canvas.style.cursor = 'crosshair';
                this.core.updateStatus('Hold mouse button and drag to create hotspot');
            }
        }
    }

    /**
     * Select a hotspot
     */
    selectHotspot(hotspot) {
        this.selectedHotspot = hotspot;
        this.updateHotspotList();
        this.updatePropertiesPanel();
        this.core.render();
        this.core.updateStatus(`Selected: ${hotspot.name}`);
    }

    /**
     * Update the hotspot list in the UI
     */
    updateHotspotList() {
        const hotspotList = document.getElementById('hotspotList');
        const hotspotCount = document.getElementById('hotspotCount');

        if (!hotspotList || !hotspotCount) return;

        hotspotCount.textContent = this.hotspots.length;

        if (this.hotspots.length === 0) {
            hotspotList.innerHTML = `
                <div class="no-selection">
                    <p>No hotspots created yet</p>
                    <p style="font-size: 11px; margin-top: 8px;">Select hotspot tool and draw to create</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.hotspots.forEach((hotspot, index) => {
            const isSelected = this.selectedHotspot === hotspot;
            html += `
                <div class="list-item ${isSelected ? 'selected' : ''}"
                     onclick="RetroQuest.modules.hotspot.selectHotspotFromList(${index})">
                    <div style="display: flex; align-items: center;">
                        <div class="color-indicator" style="background-color: ${hotspot.fillColor};"></div>
                        <div>
                            <div style="font-weight: 500;">${hotspot.name}</div>
                            <div style="font-size: 10px; color: var(--text-secondary);">${hotspot.shape.toUpperCase()}</div>
                        </div>
                    </div>
                    <span style="font-size: 10px; color: var(--text-secondary);">#${index + 1}</span>
                </div>
            `;
        });

        hotspotList.innerHTML = html;
    }

    /**
     * Select hotspot from list
     */
    selectHotspotFromList(index) {
        const hotspot = this.hotspots[index];
        if (hotspot) {
            this.selectHotspot(hotspot);
        }
    }

    /**
     * Update the properties panel for hotspot tool
     */
    updatePropertiesPanel() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (!propertiesTitle || !propertiesContent) return;

        propertiesTitle.textContent = 'HOTSPOT PROPERTIES';

        if (this.selectedHotspot) {
            this.showHotspotProperties(this.selectedHotspot);
        } else {
            this.showDefaultProperties();
        }
    }

    /**
     * Show properties for a specific hotspot
     */
    showHotspotProperties(hotspot) {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;

        propertiesContent.innerHTML = `
            <div class="property-item">
                <label class="property-label">Name</label>
                <input type="text" class="property-input" value="${hotspot.name}"
                       onchange="RetroQuest.modules.hotspot.updateHotspotProperty('${hotspot.id}', 'name', this.value)">
            </div>

            <div class="property-item">
                <label class="property-label">Shape Type</label>
                <input type="text" class="property-input" value="${hotspot.shape.toUpperCase()}" readonly
                       style="background: var(--bg-primary); color: var(--text-secondary);">
            </div>

            <div class="property-item">
                <label class="property-label">Position & Size</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; color: var(--text-secondary);">
                    <div>X: ${Math.round(hotspot.bounds.x)}</div>
                    <div>Y: ${Math.round(hotspot.bounds.y)}</div>
                    <div>W: ${Math.round(hotspot.bounds.width)}</div>
                    <div>H: ${Math.round(hotspot.bounds.height)}</div>
                </div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">
                    Use Select tool to drag hotspot around canvas
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Look Response</label>
                <textarea class="property-input" rows="3"
                          onchange="RetroQuest.modules.hotspot.updateHotspotResponse('${hotspot.id}', 'look', this.value)">${hotspot.responses.look}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Use Response</label>
                <textarea class="property-input" rows="3"
                          onchange="RetroQuest.modules.hotspot.updateHotspotResponse('${hotspot.id}', 'use', this.value)">${hotspot.responses.use}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Talk Response</label>
                <textarea class="property-input" rows="3"
                          onchange="RetroQuest.modules.hotspot.updateHotspotResponse('${hotspot.id}', 'talk', this.value)">${hotspot.responses.talk}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Take Response</label>
                <textarea class="property-input" rows="3"
                          onchange="RetroQuest.modules.hotspot.updateHotspotResponse('${hotspot.id}', 'take', this.value)">${hotspot.responses.take}</textarea>
            </div>

            <div class="property-item">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${hotspot.enabled ? 'checked' : ''}
                               onchange="RetroQuest.modules.hotspot.updateHotspotProperty('${hotspot.id}', 'enabled', this.checked)">
                        <span style="font-size: 11px;">Enabled</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${hotspot.visible ? 'checked' : ''}
                               onchange="RetroQuest.modules.hotspot.updateHotspotProperty('${hotspot.id}', 'visible', this.checked)">
                        <span style="font-size: 11px;">Visible</span>
                    </label>
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Click Action</label>
                <select class="property-input" onchange="RetroQuest.modules.hotspot.updateHotspotAction('${hotspot.id}', 'onClick', this.value)">
                    <option value="examine" ${hotspot.actions.onClick === 'examine' ? 'selected' : ''}>Examine (show look response)</option>
                    <option value="use" ${hotspot.actions.onClick === 'use' ? 'selected' : ''}>Use (trigger use response)</option>
                    <option value="talk" ${hotspot.actions.onClick === 'talk' ? 'selected' : ''}>Talk (trigger talk response)</option>
                    <option value="take" ${hotspot.actions.onClick === 'take' ? 'selected' : ''}>Take (trigger take response)</option>
                    <option value="teleport" ${hotspot.actions.onClick === 'teleport' ? 'selected' : ''}>Go to Room</option>
                </select>
            </div>

            <div class="property-item">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                    <button onclick="RetroQuest.modules.hotspot.duplicateHotspot('${hotspot.id}')" class="btn btn-secondary">
                        📋 Duplicate
                    </button>
                    <button onclick="RetroQuest.modules.hotspot.deleteHotspot(RetroQuest.modules.hotspot.getHotspotById('${hotspot.id}'))" class="btn btn-danger">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show default properties
     */
    showDefaultProperties() {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;

        propertiesContent.innerHTML = `
            <div class="no-selection">
                <p>Select hotspot tool and draw on canvas to create interactive areas</p>
                <p style="font-size: 11px; margin-top: 8px; color: var(--text-secondary);">
                    Hold and drag to draw freehand hotspots
                </p>
            </div>
        `;
    }

    /**
     * Update hotspot property
     */
    updateHotspotProperty(hotspotId, property, value) {
        const hotspot = this.getHotspotById(hotspotId);
        if (!hotspot) return;

        hotspot[property] = value;

        if (property === 'name') {
            this.updateHotspotList();
        }

        if (property === 'visible') {
            this.core.render();
        }

        this.core.updateStatus(`Updated ${property}: ${value}`);
    }

    /**
     * Update hotspot response
     */
    updateHotspotResponse(hotspotId, responseType, value) {
        const hotspot = this.getHotspotById(hotspotId);
        if (!hotspot) return;

        hotspot.responses[responseType] = value;
        this.core.updateStatus(`Updated ${responseType} response`);
    }

    /**
     * Update hotspot action
     */
    updateHotspotAction(hotspotId, actionType, value) {
        const hotspot = this.getHotspotById(hotspotId);
        if (!hotspot) return;

        hotspot.actions[actionType] = value;
        this.core.updateStatus(`Updated ${actionType} action`);
    }

    /**
     * Get hotspot by ID
     */
    getHotspotById(id) {
        return this.hotspots.find(h => h.id === id);
    }

    /**
     * Duplicate hotspot
     */
    duplicateHotspot(hotspotId) {
        const hotspot = this.getHotspotById(hotspotId);
        if (!hotspot) return;

        const newHotspot = JSON.parse(JSON.stringify(hotspot));
        newHotspot.id = `hotspot_${Date.now()}_${this.hotspotCounter}`;
        newHotspot.name = `${hotspot.name} Copy`;

        // Offset the duplicate slightly
        newHotspot.path = newHotspot.path.map(point => ({
            x: Math.min(310, point.x + 10),
            y: Math.min(190, point.y + 10)
        }));
        newHotspot.bounds = this.calculateBounds(newHotspot.path);

        this.hotspots.push(newHotspot);
        this.hotspotCounter++;

        this.updateHotspotList();
        this.selectHotspot(newHotspot);
        this.core.render();
        this.core.updateStatus(`Duplicated hotspot: ${newHotspot.name}`);
    }

    /**
     * Delete hotspot
     */
    deleteHotspot(hotspot) {
        const index = this.hotspots.indexOf(hotspot);
        if (index === -1) return;

        if (confirm(`Delete hotspot "${hotspot.name}"? This cannot be undone.`)) {
            this.hotspots.splice(index, 1);

            if (this.selectedHotspot === hotspot) {
                this.selectedHotspot = null;
                this.updatePropertiesPanel();
            }

            this.core.render();
            this.updateHotspotList();
            this.core.updateStatus(`Deleted hotspot: ${hotspot.name}`);
        }
    }

    /**
     * Show context menu
     */
    showContextMenu(event, hotspot) {
        event.preventDefault();

        const existingMenu = document.querySelector('.hotspot-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'hotspot-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            min-width: 160px;
            padding: 4px 0;
            color: var(--text-primary);
            font-family: inherit;
            font-size: 13px;
        `;

        const menuItems = [
            {
                text: `✏️ Edit "${hotspot.name}"`,
                action: () => this.selectHotspot(hotspot)
            },
            {
                text: `📋 Duplicate`,
                action: () => this.duplicateHotspot(hotspot.id)
            },
            { divider: true },
            {
                text: `🗑️ Delete "${hotspot.name}"`,
                action: () => this.deleteHotspot(hotspot),
                danger: true
            }
        ];

        menuItems.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.style.cssText = 'height: 1px; background: var(--border-color); margin: 4px 0;';
                menu.appendChild(divider);
                return;
            }

            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                color: ${item.danger ? 'var(--accent-error)' : 'inherit'};
                transition: background-color 0.15s;
            `;
            menuItem.textContent = item.text;

            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.backgroundColor = 'var(--bg-hover)';
            });

            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.backgroundColor = 'transparent';
            });

            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    /**
     * Get count of hotspots (for room module)
     */
    getCount() {
        return this.hotspots.length;
    }

    /**
     * Get all hotspots
     */
    getAllHotspots() {
        return [...this.hotspots];
    }

    /**
     * Clear all hotspots
     */
    clearAllHotspots() {
        this.hotspots = [];
        this.selectedHotspot = null;
        this.hoveredHotspot = null;
        this.hotspotCounter = 0;
        this.updateHotspotList();
        this.core.render();
    }

    /**
     * Set hotspots (for room switching)
     */
    setHotspots(hotspots) {
        this.hotspots = [...hotspots];
        this.selectedHotspot = null;
        this.hoveredHotspot = null;
        this.updateHotspotList();
        this.core.render();
    }
}

// Register the module with the core system
RetroQuest.registerModule('hotspot', new HotspotModule());

console.log('🔥 Hotspot Module: Loaded and registered');
