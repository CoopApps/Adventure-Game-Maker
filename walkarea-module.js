/**
 * RetroQuest Game Builder - Walk Area Module
 * FIXED: Now uses core.render() like the Hotspot Module
 */

class WalkAreaModule {
    constructor() {
        this.walkAreas = [];
        this.selectedWalkArea = null;
        this.hoveredWalkArea = null;
        this.walkAreaCounter = 0;
        this.core = null;

        // Drawing state
        this.isDrawing = false;
        this.currentPoints = [];

        // Drawing settings
        this.minPointDistance = 8; // Minimum distance between points
        this.closeDistance = 12; // Distance to auto-close polygon
        this.minPoints = 3; // Minimum points for valid polygon

        // Colors
        this.walkAreaColors = {
            fill: 'rgba(0, 255, 0, 0.3)',
            stroke: 'rgba(0, 255, 0, 0.8)',
            selectedFill: 'rgba(0, 200, 255, 0.4)',
            selectedStroke: 'rgba(0, 200, 255, 1)',
            hoveredFill: 'rgba(0, 255, 0, 0.5)',
            hoveredStroke: 'rgba(0, 255, 0, 1)',
            previewFill: 'rgba(0, 255, 0, 0.2)',
            previewStroke: 'rgba(0, 255, 0, 0.6)'
        };
    }

    /**
     * Initialize the walk area module
     */
    initialize(core) {
        console.log('🚶 Walk Area Module: Initializing...');
        this.core = core;

        try {
            this.updateWalkAreaList();
            console.log('✅ Walk Area Module: Initialized successfully');
        } catch (error) {
            console.error('❌ Walk Area Module: Initialization failed:', error);
        }
    }

    /**
     * Handle tool change notifications from core system
     */
    onToolChanged(newTool, previousTool) {
        if (previousTool === 'walkarea') {
            this.cancelDrawing();
        }

        if (newTool === 'walkarea') {
            this.updatePropertiesPanel();
            this.core.updateStatus('Walk area tool active - click to add points, right-click or double-click to finish');
        }
    }

    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        if (this.core.currentTool !== 'walkarea') return;

        if (e.button === 0) { // Left click
            const coords = this.core.getCanvasCoordinates(e);

            // Check if clicking on existing walk area
            const clickedWalkArea = this.getWalkAreaAtPoint(coords);
            if (clickedWalkArea && !this.isDrawing) {
                this.selectWalkArea(clickedWalkArea);
                this.showWalkAreaProperties(clickedWalkArea);
                return;
            }

            // If currently drawing, add point
            if (this.isDrawing) {
                this.addPoint(coords);
                return;
            }

            // If not drawing and didn't click on walk area, start new drawing
            if (!clickedWalkArea) {
                // If we have a selection, clear it first
                if (this.selectedWalkArea) {
                    this.clearSelection();
                    return;
                }
                // Start new drawing
                this.addPoint(coords);
            }
        } else if (e.button === 2) { // Right click
            if (this.isDrawing) {
                // Finish or cancel drawing
                if (this.currentPoints.length >= this.minPoints) {
                    this.finishDrawing();
                } else {
                    this.cancelDrawing();
                }
                return;
            } else {
                const coords = this.core.getCanvasCoordinates(e);
                const clickedWalkArea = this.getWalkAreaAtPoint(coords);
                if (clickedWalkArea) {
                    this.showContextMenu(e, clickedWalkArea);
                }
            }
        }
    }

    /**
     * Handle mouse move events
     */
    handleMouseMove(e) {
        if (this.core.currentTool !== 'walkarea') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (this.isDrawing) {
            this.updatePreview(coords);
        } else {
            this.updateHover(coords);
        }
    }

    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        // Walk area doesn't need complex mouse up handling
    }

    /**
     * Handle double click events
     */
    handleDoubleClick(e) {
        if (this.core.currentTool !== 'walkarea') return;

        if (this.isDrawing) {
            this.finishDrawing();
        }
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(e) {
        if (this.core.currentTool !== 'walkarea') return;

        if (e.key === 'Escape' && this.isDrawing) {
            e.preventDefault();
            this.cancelDrawing();
        }
    }

    /**
     * Add a point to the current walk area
     */
    addPoint(coords) {
        if (!this.isDrawing) {
            // Start new polygon
            this.isDrawing = true;
            this.currentPoints = [coords];
            this.core.canvas.style.cursor = 'crosshair';
            this.core.updateStatus('Drawing walk area... (1 point - need 3 minimum. Right-click/double-click to finish, ESC to cancel)');

            // FIXED: Use core.render() like Hotspot Module
            this.core.render();
            return;
        }

        // Handle subsequent points
        const lastPoint = this.currentPoints[this.currentPoints.length - 1];
        const distance = this.core.getDistance(coords, lastPoint);

        if (distance < this.minPointDistance) {
            return; // Too close to last point
        }

        // Check if close to first point (auto-close)
        if (this.currentPoints.length >= this.minPoints) {
            const firstPoint = this.currentPoints[0];
            const distanceToFirst = this.core.getDistance(coords, firstPoint);

            if (distanceToFirst <= this.closeDistance) {
                this.finishDrawing();
                return;
            }
        }

        // Add the point
        this.currentPoints.push(coords);

        // Update status with point count
        const pointCount = this.currentPoints.length;
        if (pointCount >= this.minPoints) {
            this.core.updateStatus(`Drawing walk area... (${pointCount} points - right-click/double-click to finish, ESC to cancel)`);
        } else {
            this.core.updateStatus(`Drawing walk area... (${pointCount} points - need ${this.minPoints} minimum. ESC to cancel)`);
        }

        // FIXED: Use core.render() like Hotspot Module
        this.core.render();
    }

    /**
     * Update preview while drawing
     */
    updatePreview(coords) {
        if (!this.isDrawing || this.currentPoints.length === 0) return;

        // Store the preview point for the render method
        this.previewPoint = coords;

        // FIXED: Use core.render() like Hotspot Module
        this.core.render();
    }

    /**
     * Finish drawing - FIXED VERSION
     */
    finishDrawing() {
        if (!this.isDrawing || this.currentPoints.length < this.minPoints) {
            this.cancelDrawing();
            return;
        }

        const walkArea = this.createWalkArea(this.currentPoints);
        this.addWalkAreaToRoom(walkArea);
        this.selectWalkArea(walkArea);
        this.showWalkAreaProperties(walkArea);

        this.isDrawing = false;
        this.currentPoints = [];
        this.previewPoint = null; // Clear preview point
        this.core.canvas.style.cursor = 'default';

        // FIXED: Use core.render() like Hotspot Module
        this.core.render();

        this.core.updateStatus(`Created walk area: ${walkArea.name}`);
    }

    /**
     * Cancel drawing operation
     */
    cancelDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentPoints = [];
            this.previewPoint = null; // Clear preview point
            if (this.core.canvas) {
                this.core.canvas.style.cursor = 'default';
            }
            // FIXED: Use core.render() like Hotspot Module
            this.core.render();
            this.core.updateStatus('Walk area drawing cancelled - Click to start new walk area');
        }
    }

    /**
     * Create a walk area object from points
     */
    createWalkArea(points) {
        const walkAreaCount = this.walkAreas.length;

        return {
            id: `walkarea_${Date.now()}`,
            name: `Walk Area ${walkAreaCount + 1}`,
            points: [...points],
            enabled: true,
            visible: true,
            type: 'walkable',
            priority: 0
        };
    }

    /**
     * Add walk area to room
     */
    addWalkAreaToRoom(walkArea) {
        this.walkAreas.push(walkArea);
        this.walkAreaCounter++;
        this.updateWalkAreaList();
        return true;
    }

    /**
     * Select a walk area
     */
    selectWalkArea(walkArea) {
        this.selectedWalkArea = walkArea;
        this.updateWalkAreaList();
        this.core.updateStatus(`Selected walk area: ${walkArea.name}`);

        // FIXED: Use core.render() like Hotspot Module
        this.core.render();
    }

    /**
     * Clear selection
     */
    clearSelection() {
        const hadSelection = this.selectedWalkArea !== null;

        this.selectedWalkArea = null;
        this.hoveredWalkArea = null;

        if (hadSelection) {
            this.updateWalkAreaList();
            this.core.render(); // FIXED: Use core.render()
            this.showDefaultProperties();
            this.core.updateStatus('Walk area selection cleared');
        }
    }

    /**
     * Update hover
     */
    updateHover(coords) {
        const hoveredWalkArea = this.getWalkAreaAtPoint(coords);

        if (hoveredWalkArea !== this.hoveredWalkArea) {
            this.hoveredWalkArea = hoveredWalkArea;

            // FIXED: Use core.render() like Hotspot Module
            this.core.render();

            if (hoveredWalkArea) {
                this.core.canvas.style.cursor = 'pointer';
                this.core.updateStatus(`Walk area: ${hoveredWalkArea.name} (click to select, right-click for menu)`);
            } else {
                this.core.canvas.style.cursor = 'crosshair';
                if (!this.isDrawing) {
                    this.core.updateStatus('Click to start drawing walk area');
                }
            }
        }
    }

    /**
     * Get walk area at a specific point
     */
    getWalkAreaAtPoint(point) {
        for (let i = this.walkAreas.length - 1; i >= 0; i--) {
            const walkArea = this.walkAreas[i];
            if (this.isPointInWalkArea(point, walkArea)) {
                return walkArea;
            }
        }
        return null;
    }

    /**
     * Check if a point is inside a walk area
     */
    isPointInWalkArea(point, walkArea) {
        if (!walkArea.points || walkArea.points.length < 3) return false;
        return this.core.pointInPolygon(point, walkArea.points);
    }

    /**
     * Render method - called by core system
     */
    render() {
        // Draw existing walk areas
        this.walkAreas.forEach((walkArea, index) => {
            if (walkArea.visible) {
                this.drawWalkArea(walkArea, index);
            }
        });

        // Draw current drawing if in progress
        if (this.isDrawing && this.currentPoints.length > 0) {
            this.drawWalkAreaPreview(this.previewPoint);
        }
    }

    /**
     * Draw all walk areas (legacy method for backward compatibility)
     */
    drawAllWalkAreas() {
        this.render();
    }

    /**
     * Draw a single walk area
     */
    drawWalkArea(walkArea, index) {
        if (!walkArea.points || walkArea.points.length < 3) return;

        const isSelected = this.selectedWalkArea && this.selectedWalkArea.id === walkArea.id;
        const isHovered = this.hoveredWalkArea && this.hoveredWalkArea.id === walkArea.id;

        const colors = this.walkAreaColors;
        let fillColor = colors.fill;
        let strokeColor = colors.stroke;
        let lineWidth = 2;

        if (isSelected) {
            fillColor = colors.selectedFill;
            strokeColor = colors.selectedStroke;
            lineWidth = 3;
        } else if (isHovered) {
            fillColor = colors.hoveredFill;
            strokeColor = colors.hoveredStroke;
            lineWidth = 2;
        } else if (!walkArea.enabled) {
            fillColor = 'rgba(128, 128, 128, 0.3)';
            strokeColor = 'rgba(128, 128, 128, 0.6)';
        }

        this.core.ctx.save();
        this.core.ctx.fillStyle = fillColor;
        this.core.ctx.strokeStyle = strokeColor;
        this.core.ctx.lineWidth = lineWidth;

        // Draw the polygon
        this.core.ctx.beginPath();
        this.core.ctx.moveTo(walkArea.points[0].x, walkArea.points[0].y);

        for (let i = 1; i < walkArea.points.length; i++) {
            this.core.ctx.lineTo(walkArea.points[i].x, walkArea.points[i].y);
        }

        this.core.ctx.closePath();
        this.core.ctx.fill();
        this.core.ctx.stroke();

        // Draw walk area label
        this.drawWalkAreaLabel(walkArea, index);

        this.core.ctx.restore();
    }

    /**
     * Draw walk area preview while drawing
     */
    drawWalkAreaPreview(previewPoint = null) {
        if (!this.isDrawing || this.currentPoints.length === 0) return;

        const colors = this.walkAreaColors;

        this.core.ctx.save();
        this.core.ctx.strokeStyle = colors.previewStroke;
        this.core.ctx.fillStyle = colors.previewFill;
        this.core.ctx.lineWidth = 2;
        this.core.ctx.setLineDash([5, 5]);

        this.core.ctx.beginPath();
        this.core.ctx.moveTo(this.currentPoints[0].x, this.currentPoints[0].y);

        // Draw lines between existing points
        for (let i = 1; i < this.currentPoints.length; i++) {
            this.core.ctx.lineTo(this.currentPoints[i].x, this.currentPoints[i].y);
        }

        // Draw preview line to mouse cursor if provided
        if (previewPoint) {
            this.core.ctx.lineTo(previewPoint.x, previewPoint.y);
        }

        // Only close and fill if we have enough points
        if (this.currentPoints.length >= this.minPoints && previewPoint) {
            // Check if mouse is close to first point for auto-close preview
            const firstPoint = this.currentPoints[0];
            const distanceToFirst = this.core.getDistance(previewPoint, firstPoint);

            if (distanceToFirst <= this.closeDistance) {
                this.core.ctx.lineTo(this.currentPoints[0].x, this.currentPoints[0].y);
                this.core.ctx.fill();
            }
        }

        this.core.ctx.stroke();
        this.core.ctx.setLineDash([]);

        // Draw points
        this.core.ctx.fillStyle = colors.stroke;
        this.currentPoints.forEach((point, index) => {
            this.core.ctx.beginPath();
            this.core.ctx.arc(point.x, point.y, index === 0 ? 4 : 3, 0, Math.PI * 2);
            this.core.ctx.fill();
        });

        // Draw first point differently to show where polygon will close
        if (this.currentPoints.length > 0) {
            this.core.ctx.fillStyle = '#ffffff';
            this.core.ctx.strokeStyle = colors.stroke;
            this.core.ctx.lineWidth = 2;
            this.core.ctx.beginPath();
            this.core.ctx.arc(this.currentPoints[0].x, this.currentPoints[0].y, 4, 0, Math.PI * 2);
            this.core.ctx.fill();
            this.core.ctx.stroke();
        }

        this.core.ctx.restore();
    }

    /**
     * Draw walk area label
     */
    drawWalkAreaLabel(walkArea, index) {
        // Calculate center point
        let centerX = 0, centerY = 0;
        walkArea.points.forEach(point => {
            centerX += point.x;
            centerY += point.y;
        });
        centerX /= walkArea.points.length;
        centerY /= walkArea.points.length;

        // Background for number
        this.core.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.core.ctx.fillRect(centerX - 12, centerY - 8, 24, 16);

        // Number text
        this.core.ctx.fillStyle = '#ffffff';
        this.core.ctx.font = 'bold 12px monospace';
        this.core.ctx.textAlign = 'center';
        this.core.ctx.textBaseline = 'middle';
        this.core.ctx.fillText(`W${index + 1}`, centerX, centerY);
    }

    /**
     * Show walk area properties
     */
    showWalkAreaProperties(walkArea) {
        this.selectWalkArea(walkArea);

        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (propertiesTitle) {
            propertiesTitle.textContent = 'WALK AREA PROPERTIES';
        }

        if (propertiesContent) {
            propertiesContent.innerHTML = `
                <div class="property-item">
                    <label class="property-label">Name</label>
                    <input type="text" class="property-input" value="${walkArea.name}"
                           onchange="RetroQuest.modules.walkarea.updateWalkAreaProperty('${walkArea.id}', 'name', this.value)">
                </div>
                <div class="property-item">
                    <label class="property-label">Type</label>
                    <select class="property-input" onchange="RetroQuest.modules.walkarea.updateWalkAreaProperty('${walkArea.id}', 'type', this.value)">
                        <option value="walkable" ${walkArea.type === 'walkable' ? 'selected' : ''}>Walkable Area</option>
                        <option value="walkbehind" ${walkArea.type === 'walkbehind' ? 'selected' : ''}>Walk-Behind Area</option>
                    </select>
                </div>
                <div class="property-item">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${walkArea.enabled ? 'checked' : ''}
                               onchange="RetroQuest.modules.walkarea.updateWalkAreaProperty('${walkArea.id}', 'enabled', this.checked)">
                        <span>Enabled</span>
                    </label>
                </div>
                <div class="property-item">
                    <label class="property-label">Polygon Info</label>
                    <div style="font-size: 12px; color: var(--text-secondary);">
                        Points: ${walkArea.points ? walkArea.points.length : 0}
                    </div>
                </div>
                <div class="property-item">
                    <button onclick="RetroQuest.modules.walkarea.deleteWalkArea('${walkArea.id}')"
                            style="width: 100%; padding: 8px; background: var(--accent-error); color: white; border: none; border-radius: 4px;">
                        Delete Walk Area
                    </button>
                </div>
            `;
        }
    }

    /**
     * Show default properties
     */
    showDefaultProperties() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (propertiesTitle) {
            propertiesTitle.textContent = 'WALK AREA PROPERTIES';
        }

        if (propertiesContent) {
            propertiesContent.innerHTML = `
                <div class="no-selection">
                    <p>Select walk area tool and click to create polygon</p>
                </div>
            `;
        }
    }

    /**
     * Update properties panel
     */
    updatePropertiesPanel() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (!propertiesTitle || !propertiesContent) return;

        propertiesTitle.textContent = 'WALK AREA PROPERTIES';

        if (this.selectedWalkArea) {
            this.showWalkAreaProperties(this.selectedWalkArea);
        } else {
            this.showDefaultProperties();
        }
    }

    /**
     * Update walk area property
     */
    updateWalkAreaProperty(walkAreaId, property, value) {
        const walkArea = this.walkAreas.find(w => w.id === walkAreaId);
        if (!walkArea) return;

        walkArea[property] = value;
        this.updateWalkAreaList();
        this.core.render(); // FIXED: Use core.render()

        this.core.updateStatus(`Updated ${property}: ${value}`);
    }

    /**
     * Delete walk area
     */
    deleteWalkArea(walkAreaId) {
        const index = this.walkAreas.findIndex(w => w.id === walkAreaId);
        if (index === -1) return;

        const walkArea = this.walkAreas[index];

        if (confirm(`Delete walk area "${walkArea.name}"? This cannot be undone.`)) {
            this.walkAreas.splice(index, 1);

            if (this.selectedWalkArea && this.selectedWalkArea.id === walkAreaId) {
                this.selectedWalkArea = null;
                this.showDefaultProperties();
            }

            this.updateWalkAreaList();
            this.core.render(); // FIXED: Use core.render()

            this.core.updateStatus(`Deleted walk area: ${walkArea.name}`);
        }
    }

    /**
     * Update walk area list
     */
    updateWalkAreaList() {
        const walkAreaList = document.getElementById('walkAreaList');
        const walkAreaCount = document.getElementById('walkAreaCount');

        if (!walkAreaList) return;

        if (walkAreaCount) {
            walkAreaCount.textContent = this.walkAreas.length;
        }

        if (this.walkAreas.length === 0) {
            walkAreaList.innerHTML = `
                <div class="no-selection">
                    <p>No walk areas defined</p>
                    <p style="font-size: 11px; margin-top: 8px;">Select walk area tool and click to create polygon</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.walkAreas.forEach((walkArea, index) => {
            const isSelected = this.selectedWalkArea === walkArea;
            html += `
                <div class="list-item ${isSelected ? 'selected' : ''}"
                     onclick="RetroQuest.modules.walkarea.selectAndShowProperties(${index})">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 12px; height: 12px; background: rgba(0, 255, 0, 0.6); border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.3);"></div>
                        <span>${walkArea.name}</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-secondary);">W${index + 1}</span>
                </div>
            `;
        });

        walkAreaList.innerHTML = html;
    }

    /**
     * Select and show properties from list
     */
    selectAndShowProperties(index) {
        const walkArea = this.walkAreas[index];
        if (walkArea) {
            this.selectWalkArea(walkArea);
            this.showWalkAreaProperties(walkArea);
        }
    }

    /**
     * Show context menu
     */
    showContextMenu(e, walkArea) {
        e.preventDefault();

        const existingMenu = document.querySelector('.walkarea-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'walkarea-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
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
                text: `Edit "${walkArea.name}"`,
                action: () => this.showWalkAreaProperties(walkArea)
            },
            {
                text: `Delete "${walkArea.name}"`,
                action: () => this.deleteWalkArea(walkArea.id),
                danger: true
            }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                color: ${item.danger ? '#f48771' : 'inherit'};
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
     * Public API methods
     */
    getAllWalkAreas() {
        return [...this.walkAreas];
    }

    getWalkAreaById(id) {
        return this.walkAreas.find(w => w.id === id);
    }

    clearAllWalkAreas() {
        this.walkAreas = [];
        this.selectedWalkArea = null;
        this.walkAreaCounter = 0;
        this.updateWalkAreaList();
        this.core.render(); // FIXED: Use core.render()
    }

    getCount() {
        return this.walkAreas.length;
    }

    setWalkAreas(walkAreas) {
        this.walkAreas = [...walkAreas];
        this.selectedWalkArea = null;
        this.hoveredWalkArea = null;
        this.updateWalkAreaList();
        this.core.render(); // FIXED: Use core.render()
    }
}

// Register the module with the core system
RetroQuest.registerModule('walkarea', new WalkAreaModule());

console.log('🚶 Walk Area Module: Loaded and registered (FIXED - Using core.render())');
