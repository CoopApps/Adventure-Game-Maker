/**
 * RetroQuest Game Builder - Select Module
 * Complete fixed version with character support
 */

class SelectModule {
    constructor() {
        this.core = null;
        this.selectedElement = null;
        this.hoveredElement = null;

        // Dragging state
        this.isDragging = false;
        this.dragElement = null;
        this.dragType = null; // 'hotspot', 'walkarea', 'object', 'character'
        this.dragOffset = { x: 0, y: 0 };
        this.dragStartPosition = null;
    }

    /**
     * Initialize the select module
     */
    initialize(core) {
        console.log('🎯 Select Module: Initializing...');
        this.core = core;

        try {
            this.setupUI();
            console.log('✅ Select Module: Initialized successfully');
        } catch (error) {
            console.error('❌ Select Module: Initialization failed:', error);
        }
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Select module doesn't need specific UI setup
        // It uses the overview properties panel
    }

    /**
     * Handle tool change notifications
     */
    onToolChanged(newTool, previousTool) {
        if (previousTool === 'select') {
            this.cancelOperation();
        }

        if (newTool === 'select') {
            this.updatePropertiesPanel();
            this.core.updateStatus('Select tool active - click elements to select and drag them around');
        }
    }

    /**
     * Cancel any ongoing operations
     */
    cancelOperation() {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragElement = null;
            this.dragType = null;
            this.dragOffset = { x: 0, y: 0 };
            this.dragStartPosition = null;
            if (this.core.canvas) {
                this.core.canvas.style.cursor = 'default';
            }
        }
    }

    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        if (this.core.currentTool !== 'select') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (e.button === 2) { // Right click
            const element = this.getElementAtPoint(coords);
            if (element) {
                this.showElementContextMenu(e, element);
            }
            return;
        }

        if (e.button === 0) { // Left click
            const element = this.getElementAtPoint(coords);

            if (element) {
                this.selectElement(element);
                this.startDragging(element, coords);
            } else {
                this.clearSelection();
            }
        }
    }

    /**
     * Handle mouse move events
     */
    handleMouseMove(e) {
        if (this.core.currentTool !== 'select') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (this.isDragging && this.dragElement) {
            this.continueDragging(coords);
        } else {
            this.updateHover(coords);
        }
    }

    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        if (this.core.currentTool !== 'select') return;

        if (this.isDragging && this.dragElement) {
            this.finishDragging();
        }
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(e) {
        if (this.core.currentTool !== 'select') return;

        if (e.key === 'Delete' && this.selectedElement) {
            this.deleteSelectedElement();
        }
    }

    /**
     * Get any element (hotspot, walk area, object, or character) at a point
     */
    getElementAtPoint(point) {
        // Check characters first (they should be on top)
        if (this.core.modules.character) {
            const character = this.core.modules.character.getCharacterAtPosition(point.x, point.y);
            if (character) {
                return { type: 'character', element: character, module: this.core.modules.character };
            }
        }

        // Check objects next (they're on top)
        if (this.core.modules.object) {
            const object = this.core.modules.object.getObjectAtPoint(point);
            if (object) {
                return { type: 'object', element: object, module: this.core.modules.object };
            }
        }

        // Check hotspots
        if (this.core.modules.hotspot) {
            const hotspot = this.core.modules.hotspot.getHotspotAtPoint(point);
            if (hotspot) {
                return { type: 'hotspot', element: hotspot, module: this.core.modules.hotspot };
            }
        }

        // Check walk areas last (they're at the bottom)
        if (this.core.modules.walkarea) {
            const walkArea = this.core.modules.walkarea.getWalkAreaAtPoint(point);
            if (walkArea) {
                return { type: 'walkarea', element: walkArea, module: this.core.modules.walkarea };
            }
        }

        return null;
    }

    /**
     * Select an element
     */
    selectElement(elementData) {
        // Clear previous selection in all modules
        this.clearAllModuleSelections();

        // Set new selection in appropriate module
        if (elementData.type === 'character' && elementData.module && elementData.module.selectCharacter) {
            elementData.module.selectCharacter(elementData.element.id);
        } else if (elementData.module && elementData.module.selectElement) {
            elementData.module.selectElement(elementData.element);
        } else if (elementData.module && elementData.module.selectHotspot) {
            elementData.module.selectHotspot(elementData.element);
        } else if (elementData.module && elementData.module.selectWalkArea) {
            elementData.module.selectWalkArea(elementData.element);
        } else if (elementData.module && elementData.module.selectObject) {
            elementData.module.selectObject(elementData.element);
        }

        this.selectedElement = elementData;
        this.updatePropertiesPanel();
        this.core.render();

        this.core.updateStatus(`Selected ${elementData.type}: ${elementData.element.name}`);
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.clearAllModuleSelections();
        this.selectedElement = null;
        this.hoveredElement = null;
        this.updatePropertiesPanel();
        this.core.render();
        this.core.updateStatus('Selection cleared');
    }

    /**
     * Clear selections in all modules
     */
    clearAllModuleSelections() {
        if (this.core.modules.character) {
            this.core.modules.character.selectedCharacter = null;
        }
        if (this.core.modules.hotspot) {
            this.core.modules.hotspot.selectedHotspot = null;
            this.core.modules.hotspot.hoveredHotspot = null;
        }
        if (this.core.modules.walkarea) {
            this.core.modules.walkarea.selectedWalkArea = null;
            this.core.modules.walkarea.hoveredWalkArea = null;
        }
        if (this.core.modules.object) {
            this.core.modules.object.selectedObject = null;
            this.core.modules.object.hoveredObject = null;
        }
    }

    /**
     * Start dragging an element
     */
    startDragging(elementData, coords) {
        this.isDragging = true;
        this.dragElement = elementData.element;
        this.dragType = elementData.type;

        // Calculate drag offset based on element type
        if (elementData.type === 'character') {
            this.dragOffset = {
                x: coords.x - elementData.element.x,
                y: coords.y - elementData.element.y
            };
        } else if (elementData.type === 'hotspot') {
            this.dragStartPosition = this.getHotspotCenter(elementData.element.path);
            this.dragOffset = {
                x: coords.x - this.dragStartPosition.x,
                y: coords.y - this.dragStartPosition.y
            };
        } else if (elementData.type === 'walkarea') {
            this.dragStartPosition = this.getWalkAreaCenter(elementData.element.points);
            this.dragOffset = {
                x: coords.x - this.dragStartPosition.x,
                y: coords.y - this.dragStartPosition.y
            };
        } else if (elementData.type === 'object') {
            this.dragOffset = {
                x: coords.x - elementData.element.position.x,
                y: coords.y - elementData.element.position.y
            };
        }

        if (this.core.canvas) {
            this.core.canvas.style.cursor = 'grabbing';
        }
        this.core.updateStatus(`Dragging ${elementData.type}: ${elementData.element.name}`);
    }

    /**
     * Continue dragging an element
     */
    continueDragging(coords) {
        if (!this.isDragging || !this.dragElement) return;

        const newCenterX = coords.x - this.dragOffset.x;
        const newCenterY = coords.y - this.dragOffset.y;

        if (this.dragType === 'character') {
            // Update character position directly
            const clampedX = Math.max(16, Math.min(304, newCenterX));
            const clampedY = Math.max(48, Math.min(200, newCenterY));

            // Update character position using the character module's method
            if (this.core.modules.character && this.core.modules.character.updateCharacterPosition) {
                this.core.modules.character.updateCharacterPosition(this.dragElement.id, clampedX, clampedY);
            }

        } else if (this.dragType === 'hotspot') {
            // Update hotspot position
            const deltaX = newCenterX - this.dragStartPosition.x;
            const deltaY = newCenterY - this.dragStartPosition.y;

            this.dragElement.path = this.dragElement.path.map(point => ({
                x: Math.max(0, Math.min(319, point.x + deltaX)),
                y: Math.max(0, Math.min(199, point.y + deltaY))
            }));

            this.dragStartPosition = { x: newCenterX, y: newCenterY };

        } else if (this.dragType === 'walkarea') {
            // Update walk area position
            const deltaX = newCenterX - this.dragStartPosition.x;
            const deltaY = newCenterY - this.dragStartPosition.y;

            this.dragElement.points = this.dragElement.points.map(point => ({
                x: Math.max(0, Math.min(319, point.x + deltaX)),
                y: Math.max(0, Math.min(199, point.y + deltaY))
            }));

            this.dragStartPosition = { x: newCenterX, y: newCenterY };

        } else if (this.dragType === 'object') {
            // Update object position directly
            this.dragElement.position.x = Math.max(10, Math.min(310, newCenterX));
            this.dragElement.position.y = Math.max(10, Math.min(190, newCenterY));
        }

        // Re-render
        this.core.render();
    }

    /**
     * Finish dragging an element
     */
    finishDragging() {
        if (!this.isDragging || !this.dragElement) return;

        this.isDragging = false;
        const draggedElement = this.dragElement;
        const draggedType = this.dragType;

        // Save character data if it was a character
        if (draggedType === 'character' && this.core.modules.character && this.core.modules.character.saveCharacterData) {
            this.core.modules.character.saveCharacterData();
        }

        this.dragElement = null;
        this.dragType = null;
        this.dragOffset = { x: 0, y: 0 };
        this.dragStartPosition = null;

        if (this.core.canvas) {
            this.core.canvas.style.cursor = 'grab';
        }
        this.core.updateStatus(`Moved ${draggedType}: ${draggedElement.name}`);

        // Update properties panel with new position
        this.updatePropertiesPanel();
    }

    /**
     * Update hover state
     */
    updateHover(coords) {
        const hoveredElement = this.getElementAtPoint(coords);

        if (hoveredElement !== this.hoveredElement) {
            this.hoveredElement = hoveredElement;

            // Clear hover states in all modules
            if (this.core.modules.character) {
                // Characters don't have hover states currently
            }
            if (this.core.modules.hotspot) {
                this.core.modules.hotspot.hoveredHotspot = null;
            }
            if (this.core.modules.walkarea) {
                this.core.modules.walkarea.hoveredWalkArea = null;
            }
            if (this.core.modules.object) {
                this.core.modules.object.hoveredObject = null;
            }

            // Set hover state in appropriate module
            if (hoveredElement) {
                if (hoveredElement.type === 'character') {
                    // Characters don't have hover states currently
                } else if (hoveredElement.type === 'hotspot' && this.core.modules.hotspot) {
                    this.core.modules.hotspot.hoveredHotspot = hoveredElement.element;
                } else if (hoveredElement.type === 'walkarea' && this.core.modules.walkarea) {
                    this.core.modules.walkarea.hoveredWalkArea = hoveredElement.element;
                } else if (hoveredElement.type === 'object' && this.core.modules.object) {
                    this.core.modules.object.hoveredObject = hoveredElement.element;
                }

                if (this.core.canvas) {
                    this.core.canvas.style.cursor = 'grab';
                }
                this.core.updateStatus(`${hoveredElement.type}: ${hoveredElement.element.name} (click to select and drag, right-click for menu)`);
            } else {
                if (this.core.canvas) {
                    this.core.canvas.style.cursor = 'default';
                }
                this.core.updateStatus('Select tool active - click elements to select and drag them around');
            }

            this.core.render();
        }
    }

    /**
     * Update the properties panel for select tool
     */
    updatePropertiesPanel() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (!propertiesTitle || !propertiesContent) return;

        if (this.selectedElement) {
            // Show properties for selected element
            const element = this.selectedElement.element;
            const type = this.selectedElement.type;

            propertiesTitle.textContent = `${type.toUpperCase()} PROPERTIES`;

            // Delegate to appropriate module for properties display
            if (this.selectedElement.module && this.selectedElement.module.updatePropertiesPanel) {
                this.selectedElement.module.updatePropertiesPanel();
            }
        } else {
            // Show overview
            propertiesTitle.textContent = 'ROOM OVERVIEW';
            this.showOverviewProperties();
        }
    }

    /**
     * Show overview properties
     */
    showOverviewProperties() {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;

        const characterCount = this.core.modules.character ? this.core.modules.character.getCharacters().length : 0;
        const hotspotCount = this.core.modules.hotspot ? this.core.modules.hotspot.getCount() : 0;
        const walkAreaCount = this.core.modules.walkarea ? this.core.modules.walkarea.getCount() : 0;
        const objectCount = this.core.modules.object ? this.core.modules.object.getCount() : 0;

        propertiesContent.innerHTML = `
            <div class="property-item">
                <label class="property-label">Room Elements</label>
                <div style="font-size: 12px; color: var(--text-secondary);">
                    <div>Characters: ${characterCount}</div>
                    <div>Hotspots: ${hotspotCount}</div>
                    <div>Walk Areas: ${walkAreaCount}</div>
                    <div>Objects: ${objectCount}</div>
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">All Elements</label>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${this.generateElementList()}
                </div>
            </div>
        `;
    }

    /**
     * Generate list of all elements for overview
     */
    generateElementList() {
        let html = '';

        // Characters
        if (this.core.modules.character) {
            const characters = this.core.modules.character.getCharacters();
            characters.forEach((character, index) => {
                html += `
                    <div class="list-item ${this.selectedElement?.element?.id === character.id ? 'selected' : ''}"
                         onclick="RetroQuest.modules.select.selectElementById('character', '${character.id}')"
                         style="margin: 2px 0; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 12px;">${character.sprite}</span>
                            <span>${character.name}</span>
                        </div>
                        <span style="color: var(--text-secondary);">C${index + 1}</span>
                    </div>
                `;
            });
        }

        // Hotspots
        if (this.core.modules.hotspot) {
            const hotspots = this.core.modules.hotspot.getAllHotspots();
            hotspots.forEach((hotspot, index) => {
                html += `
                    <div class="list-item ${this.selectedElement?.element?.id === hotspot.id ? 'selected' : ''}"
                         onclick="RetroQuest.modules.select.selectElementById('hotspot', '${hotspot.id}')"
                         style="margin: 2px 0; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 12px; height: 12px; background: var(--hotspot-color, #ff6b6b); border-radius: 2px;"></div>
                            <span>${hotspot.name}</span>
                        </div>
                        <span style="color: var(--text-secondary);">H${index + 1}</span>
                    </div>
                `;
            });
        }

        // Walk Areas
        if (this.core.modules.walkarea) {
            const walkAreas = this.core.modules.walkarea.getAllWalkAreas();
            walkAreas.forEach((walkArea, index) => {
                html += `
                    <div class="list-item ${this.selectedElement?.element?.id === walkArea.id ? 'selected' : ''}"
                         onclick="RetroQuest.modules.select.selectElementById('walkarea', '${walkArea.id}')"
                         style="margin: 2px 0; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 12px; height: 12px; background: var(--walkarea-color, #4ecdc4); border-radius: 2px;"></div>
                            <span>${walkArea.name}</span>
                        </div>
                        <span style="color: var(--text-secondary);">W${index + 1}</span>
                    </div>
                `;
            });
        }

        // Objects
        if (this.core.modules.object) {
            const objects = this.core.modules.object.getAllObjects();
            objects.forEach((object, index) => {
                html += `
                    <div class="list-item ${this.selectedElement?.element?.id === object.id ? 'selected' : ''}"
                         onclick="RetroQuest.modules.select.selectElementById('object', '${object.id}')"
                         style="margin: 2px 0; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 12px;">${object.sprite}</span>
                            <span>${object.name}</span>
                        </div>
                        <span style="color: var(--text-secondary);">O${index + 1}</span>
                    </div>
                `;
            });
        }

        if (html === '') {
            html = '<div style="color: var(--text-secondary); font-style: italic; text-align: center; padding: 20px;">No elements created yet</div>';
        }

        return html;
    }

    /**
     * Select element by ID (called from overview list)
     */
    selectElementById(type, id) {
        let element = null;
        let module = null;

        if (type === 'character' && this.core.modules.character) {
            element = this.core.modules.character.getCharacterById(id);
            module = this.core.modules.character;
        } else if (type === 'hotspot' && this.core.modules.hotspot) {
            element = this.core.modules.hotspot.getHotspotById(id);
            module = this.core.modules.hotspot;
        } else if (type === 'walkarea' && this.core.modules.walkarea) {
            element = this.core.modules.walkarea.getWalkAreaById(id);
            module = this.core.modules.walkarea;
        } else if (type === 'object' && this.core.modules.object) {
            element = this.core.modules.object.getObjectById(id);
            module = this.core.modules.object;
        }

        if (element && module) {
            this.selectElement({ type, element, module });
        }
    }

    /**
     * Delete selected element
     */
    deleteSelectedElement() {
        if (!this.selectedElement) return;

        const element = this.selectedElement.element;
        const type = this.selectedElement.type;

        if (confirm(`Delete ${type} "${element.name}"? This cannot be undone.`)) {
            if (type === 'character' && this.core.modules.character) {
                // Characters use deleteCharacter method that checks selectedCharacter
                this.core.modules.character.selectedCharacter = element;
                this.core.modules.character.deleteCharacter();
            } else if (type === 'hotspot' && this.core.modules.hotspot) {
                this.core.modules.hotspot.deleteHotspot(element);
            } else if (type === 'walkarea' && this.core.modules.walkarea) {
                this.core.modules.walkarea.deleteWalkArea(element);
            } else if (type === 'object' && this.core.modules.object) {
                this.core.modules.object.deleteObject(element);
            }

            this.selectedElement = null;
            this.updatePropertiesPanel();
            this.core.render();
            this.core.updateStatus(`Deleted ${type}: ${element.name}`);
        }
    }

    /**
     * Show context menu for element
     */
    showElementContextMenu(event, elementData) {
        // Delegate to appropriate module's context menu
        if (elementData.module && elementData.module.showContextMenu) {
            elementData.module.showContextMenu(event, elementData.element);
        }
    }

    /**
     * Get center of hotspot path
     */
    getHotspotCenter(path) {
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
     * Get center of walk area points
     */
    getWalkAreaCenter(points) {
        let centerX = 0, centerY = 0;

        for (const point of points) {
            centerX += point.x;
            centerY += point.y;
        }

        return {
            x: centerX / points.length,
            y: centerY / points.length
        };
    }

    /**
     * Calculate bounds for hotspot path
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
}

// Register the module with the core system
RetroQuest.registerModule('select', new SelectModule());

console.log('🎯 Select Module: Loaded and registered with character support');
