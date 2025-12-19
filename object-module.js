/**
 * RetroQuest Game Builder - Object Module
 * Handles object library, placement, and interaction management
 */

class ObjectModule {
    constructor() {
        this.objects = [];
        this.objectLibrary = [];
        this.selectedObject = null;
        this.hoveredObject = null;
        this.objectCounter = 0;
        this.core = null;

        // Drag and drop state
        this.isDragging = false;
        this.dragObject = null;
        this.dragOffset = { x: 0, y: 0 };
        this.dragObjectType = null;

        // Default object types for the library
        this.defaultObjectTypes = [
            {
                id: 'key',
                name: 'Key',
                description: 'A metal key',
                sprite: '🗝️',
                takeable: true,
                combinable: true,
                category: 'Items'
            },
            {
                id: 'door',
                name: 'Door',
                description: 'A wooden door',
                sprite: '🚪',
                takeable: false,
                combinable: false,
                category: 'Interactive'
            },
            {
                id: 'chest',
                name: 'Chest',
                description: 'A treasure chest',
                sprite: '📦',
                takeable: false,
                combinable: false,
                category: 'Containers'
            },
            {
                id: 'book',
                name: 'Book',
                description: 'An old book',
                sprite: '📚',
                takeable: true,
                combinable: true,
                category: 'Items'
            },
            {
                id: 'lamp',
                name: 'Lamp',
                description: 'An oil lamp',
                sprite: '🔦',
                takeable: true,
                combinable: true,
                category: 'Items'
            },
            {
                id: 'switch',
                name: 'Switch',
                description: 'A wall switch',
                sprite: '🔘',
                takeable: false,
                combinable: false,
                category: 'Interactive'
            },
            {
                id: 'coin',
                name: 'Coin',
                description: 'A gold coin',
                sprite: '🪙',
                takeable: true,
                combinable: true,
                category: 'Items'
            },
            {
                id: 'potion',
                name: 'Potion',
                description: 'A magic potion',
                sprite: '🧪',
                takeable: true,
                combinable: true,
                category: 'Items'
            },
            {
                id: 'sword',
                name: 'Sword',
                description: 'A sharp sword',
                sprite: '⚔️',
                takeable: true,
                combinable: true,
                category: 'Weapons'
            },
            {
                id: 'shield',
                name: 'Shield',
                description: 'A sturdy shield',
                sprite: '🛡️',
                takeable: true,
                combinable: true,
                category: 'Weapons'
            }
        ];
    }

    /**
     * Initialize the object module
     */
    initialize(core) {
        console.log('📦 Object Module: Initializing...');
        this.core = core;

        try {
            this.initializeObjectLibrary();
            this.setupUI();
            this.setupDragAndDrop();
            this.updateObjectLibrary();
            this.updateObjectList();

            console.log('✅ Object Module: Initialized successfully');
        } catch (error) {
            console.error('❌ Object Module: Initialization failed:', error);
        }
    }

    /**
     * Initialize object library with default types
     */
    initializeObjectLibrary() {
        this.objectLibrary = [...this.defaultObjectTypes];
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Object library and list will be updated by respective methods
        // Properties panel will be updated by updatePropertiesPanel()
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        // Canvas drop handling is managed by the core system
        // Object library drag start is handled in updateObjectLibrary()
    }

    /**
     * Handle tool change notifications
     */
    onToolChanged(newTool, previousTool) {
        if (previousTool === 'object') {
            this.cancelOperation();
        }

        if (newTool === 'object') {
            this.updatePropertiesPanel();
            this.core.updateStatus('Object tool active - drag objects from library to place them');
        }
    }

    /**
     * Cancel any ongoing operations
     */
    cancelOperation() {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragObject = null;
            this.dragOffset = { x: 0, y: 0 };
            this.core.canvas.style.cursor = 'default';
        }
    }

    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        if (this.core.currentTool !== 'object') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (e.button === 0) { // Left click
            const clickedObject = this.getObjectAtPoint(coords);

            if (clickedObject) {
                this.selectObject(clickedObject);

                // Start dragging existing object
                this.isDragging = true;
                this.dragObject = clickedObject;
                this.dragOffset = {
                    x: coords.x - clickedObject.position.x,
                    y: coords.y - clickedObject.position.y
                };

                this.core.updateStatus(`Dragging ${clickedObject.name}...`);

            } else {
                // Clear selection if clicking empty space
                this.clearSelection();
            }
        } else if (e.button === 2) { // Right click
            const clickedObject = this.getObjectAtPoint(coords);
            if (clickedObject) {
                this.showContextMenu(e, clickedObject);
            }
        }
    }

    /**
     * Handle mouse move events
     */
    handleMouseMove(e) {
        if (this.core.currentTool !== 'object') return;

        const coords = this.core.getCanvasCoordinates(e);

        if (this.isDragging && this.dragObject) {
            // Update object position while dragging
            const newX = coords.x - this.dragOffset.x;
            const newY = coords.y - this.dragOffset.y;

            // Keep within canvas bounds
            this.dragObject.position.x = Math.max(10, Math.min(310, newX));
            this.dragObject.position.y = Math.max(10, Math.min(190, newY));

            // Update cursor to show dragging
            this.core.canvas.style.cursor = 'grabbing';

            // Re-render to show new position
            this.core.render();

        } else {
            this.updateHover(coords);
        }
    }

    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        if (this.core.currentTool !== 'object') return;

        if (this.isDragging && this.dragObject) {
            // Finish dragging
            this.isDragging = false;
            const draggedObject = this.dragObject;
            this.dragObject = null;
            this.dragOffset = { x: 0, y: 0 };

            // Reset cursor
            this.core.canvas.style.cursor = 'default';

            // Update status
            this.core.updateStatus(`Moved ${draggedObject.name} to (${draggedObject.position.x}, ${draggedObject.position.y})`);

            // Update properties panel with new position
            if (this.selectedObject && this.selectedObject.id === draggedObject.id) {
                this.updatePropertiesPanel();
            }
        }
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(e) {
        if (this.core.currentTool !== 'object') return;

        if (e.key === 'Delete' && this.selectedObject) {
            this.deleteObject(this.selectedObject);
        }
    }

    /**
     * Handle object drop from library
     */
    handleObjectDrop(data, coords) {
        if (data.objectType) {
            const newObject = this.createObjectFromType(data.objectType, coords);
            this.addObjectToRoom(newObject);
            this.selectObject(newObject);
            this.core.updateStatus(`Added ${newObject.name} to room at (${coords.x}, ${coords.y})`);
        }
    }

    /**
     * Create object from library type
     */
    createObjectFromType(objectType, position) {
        const object = {
            id: `object_${Date.now()}_${this.objectCounter}`,
            name: `${objectType.name} ${this.objectCounter + 1}`,
            description: objectType.description,
            typeId: objectType.id,
            position: { ...position },
            sprite: objectType.sprite,
            takeable: objectType.takeable,
            combinable: objectType.combinable,
            visible: true,
            enabled: true,
            state: 'default',
            created: new Date().toISOString(),

            // Hotspot mapping properties
            linkedHotspot: null,
            pickupBehavior: 'take',
            customAction: '',
            unlocks: '',
            targetHotspot: null,

            states: {
                default: {
                    sprite: objectType.sprite,
                    description: objectType.description
                }
            },
            responses: {
                look: `You see ${objectType.description.toLowerCase()}.`,
                use: objectType.takeable ? `You take the ${objectType.name.toLowerCase()}.` : `You can't use the ${objectType.name.toLowerCase()}.`,
                talk: `The ${objectType.name.toLowerCase()} doesn't respond.`,
                take: objectType.takeable ? `You take the ${objectType.name.toLowerCase()}.` : `You can't take the ${objectType.name.toLowerCase()}.`
            },
            conditions: {
                visibleWhen: null,
                enabledWhen: null,
                requiredFlag: null,
                requiredItem: null
            },
            interactions: {
                onTake: null,
                onUse: null,
                onCombineWith: {}
            }
        };

        this.objectCounter++;
        return object;
    }

    /**
     * Add object to current room
     */
    addObjectToRoom(object) {
        this.objects.push(object);
        this.updateObjectList();
        this.core.render();
        return true;
    }

    /**
     * Render all objects
     */
    render() {
        this.objects.forEach((object, index) => {
            if (object.visible) {
                this.drawObject(object, index);
            }
        });
    }

    /**
     * Draw a single object
     */
    drawObject(object, index) {
        const isSelected = this.selectedObject && this.selectedObject.id === object.id;
        const isHovered = this.hoveredObject && this.hoveredObject.id === object.id;

        this.core.ctx.save();

        // Draw object sprite/emoji
        this.core.ctx.font = '20px Arial';
        this.core.ctx.textAlign = 'center';
        this.core.ctx.textBaseline = 'middle';

        // Add glow effect for selected/hovered objects
        if (isSelected || isHovered) {
            this.core.ctx.shadowColor = isSelected ? '#007acc' : '#ffffff';
            this.core.ctx.shadowBlur = 10;
        } else {
            this.core.ctx.shadowBlur = 0;
        }

        // Draw the sprite
        this.core.ctx.fillStyle = object.enabled ? '#ffffff' : '#888888';
        this.core.ctx.fillText(object.sprite, object.position.x, object.position.y);

        // Reset shadow
        this.core.ctx.shadowBlur = 0;

        // Draw selection indicator
        if (isSelected) {
            this.core.ctx.strokeStyle = '#007acc';
            this.core.ctx.lineWidth = 2;
            this.core.ctx.strokeRect(object.position.x - 12, object.position.y - 12, 24, 24);
        }

        // Draw object number
        this.core.ctx.font = 'bold 10px monospace';
        this.core.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.core.ctx.fillRect(object.position.x - 15, object.position.y - 15, 16, 12);

        this.core.ctx.fillStyle = '#ffffff';
        this.core.ctx.textAlign = 'center';
        this.core.ctx.fillText(`O${index + 1}`, object.position.x - 7, object.position.y - 9);

        this.core.ctx.restore();
    }

    /**
     * Check if point is in object bounds
     */
    isPointInObject(point, object) {
        if (!object.visible) return false;

        // Simple rectangular bounds check (20x20 pixels around position)
        const bounds = {
            x: object.position.x - 10,
            y: object.position.y - 10,
            width: 20,
            height: 20
        };

        return point.x >= bounds.x &&
               point.x <= bounds.x + bounds.width &&
               point.y >= bounds.y &&
               point.y <= bounds.y + bounds.height;
    }

    /**
     * Get object at a specific point
     */
    getObjectAtPoint(point) {
        // Check in reverse order (top object first)
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            if (this.isPointInObject(point, object)) {
                return object;
            }
        }
        return null;
    }

    /**
     * Update hover state
     */
    updateHover(coords) {
        const hoveredObject = this.getObjectAtPoint(coords);

        if (hoveredObject !== this.hoveredObject) {
            this.hoveredObject = hoveredObject;
            this.core.render();

            if (hoveredObject) {
                this.core.canvas.style.cursor = 'grab';
                this.core.updateStatus(`Object: ${hoveredObject.name} (click and drag to move, right-click for menu)`);
            } else {
                this.core.canvas.style.cursor = 'default';
                this.core.updateStatus('Drag objects from the library to place them in the room');
            }
        }
    }

    /**
     * Select an object
     */
    selectObject(object) {
        this.selectedObject = object;
        this.updateObjectList();
        this.updatePropertiesPanel();
        this.core.render();
        this.core.updateStatus(`Selected object: ${object.name}`);
    }

    /**
     * Clear object selection
     */
    clearSelection() {
        const hadSelection = this.selectedObject !== null;

        this.selectedObject = null;
        this.hoveredObject = null;

        if (hadSelection) {
            this.updateObjectList();
            this.updatePropertiesPanel();
            this.core.render();
            this.core.updateStatus('Object selection cleared');
        }
    }

    /**
     * Update the object library in the UI
     */
    updateObjectLibrary() {
        const objectLibrary = document.getElementById('objectLibrary');
        if (!objectLibrary) return;

        // Group objects by category
        const categories = {};
        this.objectLibrary.forEach(obj => {
            if (!categories[obj.category]) {
                categories[obj.category] = [];
            }
            categories[obj.category].push(obj);
        });

        let html = '';
        Object.keys(categories).forEach(category => {
            html += `
                <div style="margin: 4px 0;">
                    <div style="font-size: 10px; color: var(--text-secondary); font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">
                        ${category}
                    </div>
            `;

            categories[category].forEach(obj => {
                html += `
                    <div class="object-library-item" draggable="true" data-object-type="${obj.id}"
                         ondragstart="RetroQuest.modules.object.handleLibraryDragStart(event, '${obj.id}')">
                        <span class="object-sprite">${obj.sprite}</span>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: bold; font-size: 11px;">${obj.name}</div>
                            <div style="font-size: 9px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${obj.description}</div>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        });

        // Add instruction at bottom
        html += `
            <div style="padding: 8px; font-size: 10px; color: var(--text-secondary); font-style: italic; border-top: 1px solid var(--border-color); margin-top: 8px;">
                💡 Drag items to the canvas to add them to the room
            </div>
        `;

        objectLibrary.innerHTML = html;
    }

    /**
     * Handle drag start from object library
     */
    handleLibraryDragStart(e, objectTypeId) {
        console.log('🖱️ Drag started for object type:', objectTypeId);

        const objectType = this.objectLibrary.find(obj => obj.id === objectTypeId);
        if (objectType) {
            e.dataTransfer.setData('application/json', JSON.stringify({
                objectType: objectType
            }));
            e.dataTransfer.effectAllowed = 'copy';

            // Store for later use
            this.dragObjectType = objectType;

            // Visual feedback
            e.target.style.opacity = '0.5';
            setTimeout(() => {
                e.target.style.opacity = '1';
            }, 100);
        }
    }

    /**
     * Update the object list in the UI
     */
    updateObjectList() {
        const objectList = document.getElementById('objectList');
        const objectCount = document.getElementById('objectCount');

        if (!objectList || !objectCount) return;

        objectCount.textContent = this.objects.length;

        if (this.objects.length === 0) {
            objectList.innerHTML = `
                <div class="no-selection">
                    <p>No objects in room</p>
                    <p style="font-size: 11px; margin-top: 8px;">Drag objects from library to add them</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.objects.forEach((object, index) => {
            const isSelected = this.selectedObject === object;
            html += `
                <div class="list-item ${isSelected ? 'selected' : ''}"
                     onclick="RetroQuest.modules.object.selectObjectFromList(${index})">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 14px;">${object.sprite}</span>
                        <span>${object.name}</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-secondary);">O${index + 1}</span>
                </div>
            `;
        });

        objectList.innerHTML = html;
    }

    /**
     * Select object from list
     */
    selectObjectFromList(index) {
        const object = this.objects[index];
        if (object) {
            this.selectObject(object);
        }
    }

    /**
     * Update the properties panel for object tool
     */
    updatePropertiesPanel() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (!propertiesTitle || !propertiesContent) return;

        propertiesTitle.textContent = 'OBJECT PROPERTIES';

        if (this.selectedObject) {
            this.showObjectProperties(this.selectedObject);
        } else {
            this.showDefaultProperties();
        }
    }

    /**
     * Show properties for a specific object
     */
    showObjectProperties(object) {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;

        const hotspotOptions = this.buildHotspotOptions(object.linkedHotspot);

        propertiesContent.innerHTML = `
            <div class="property-item">
                <label class="property-label">Name</label>
                <input type="text" class="property-input" value="${object.name}"
                       onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'name', this.value)">
            </div>

            <div class="property-item">
                <label class="property-label">Description</label>
                <textarea class="property-input" rows="2"
                          onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'description', this.value)">${object.description}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Look Response</label>
                <textarea class="property-input" rows="2"
                          onchange="RetroQuest.modules.object.updateObjectResponse('${object.id}', 'look', this.value)">${object.responses.look}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Use Response</label>
                <textarea class="property-input" rows="2"
                          onchange="RetroQuest.modules.object.updateObjectResponse('${object.id}', 'use', this.value)">${object.responses.use}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Linked Hotspot</label>
                <select class="property-input" onchange="RetroQuest.modules.object.linkObjectToHotspot('${object.id}', this.value)">
                    ${hotspotOptions}
                </select>
                <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">
                    Link to hotspot so clicking hotspot area interacts with this object
                </div>
            </div>

            <div class="property-item">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${object.takeable ? 'checked' : ''}
                               onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'takeable', this.checked)">
                        <span style="font-size: 11px;">Takeable</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${object.combinable ? 'checked' : ''}
                               onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'combinable', this.checked)">
                        <span style="font-size: 11px;">Combinable</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${object.visible ? 'checked' : ''}
                               onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'visible', this.checked)">
                        <span style="font-size: 11px;">Visible</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px;">
                        <input type="checkbox" ${object.enabled ? 'checked' : ''}
                               onchange="RetroQuest.modules.object.updateObjectProperty('${object.id}', 'enabled', this.checked)">
                        <span style="font-size: 11px;">Enabled</span>
                    </label>
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Position</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <input type="number" class="property-input" value="${object.position.x}" min="0" max="300"
                           onchange="RetroQuest.modules.object.updateObjectPosition('${object.id}', 'x', parseInt(this.value))">
                    <input type="number" class="property-input" value="${object.position.y}" min="0" max="180"
                           onchange="RetroQuest.modules.object.updateObjectPosition('${object.id}', 'y', parseInt(this.value))">
                </div>
            </div>

            <div class="property-item">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                    <button onclick="RetroQuest.modules.object.duplicateObject('${object.id}')" class="btn btn-secondary">
                        📋 Duplicate
                    </button>
                    <button onclick="RetroQuest.modules.object.deleteObject(RetroQuest.modules.object.getObjectById('${object.id}'))" class="btn btn-danger">
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
                <p>Select object tool and drag objects from library</p>
                <p style="font-size: 11px; margin-top: 8px; color: var(--text-secondary);">
                    Objects can be linked to hotspots for interaction
                </p>
            </div>
        `;
    }

    /**
     * Build hotspot options for select dropdown
     */
    buildHotspotOptions(selectedHotspotId = null) {
        let options = '<option value="">None - click object directly</option>';

        if (this.core.modules.hotspot && this.core.modules.hotspot.getAllHotspots) {
            const hotspots = this.core.modules.hotspot.getAllHotspots();
            hotspots.forEach(hotspot => {
                const selected = hotspot.id === selectedHotspotId ? 'selected' : '';
                options += `<option value="${hotspot.id}" ${selected}>${hotspot.name}</option>`;
            });
        }

        return options;
    }

    /**
     * Link object to hotspot
     */
    linkObjectToHotspot(objectId, hotspotId) {
        const object = this.getObjectById(objectId);
        if (!object) return;

        // Remove old link if exists
        if (object.linkedHotspot) {
            // TODO: Update old hotspot to remove link
        }

        // Set new link
        object.linkedHotspot = hotspotId;

        if (hotspotId) {
            this.core.updateStatus(`Linked ${object.name} to hotspot`);
        } else {
            this.core.updateStatus(`Unlinked ${object.name} from hotspot`);
        }

        this.core.render();
    }

    /**
     * Update object property
     */
    updateObjectProperty(objectId, property, value) {
        const object = this.getObjectById(objectId);
        if (!object) return;

        object[property] = value;

        if (property === 'name') {
            this.updateObjectList();
        }

        if (property === 'visible') {
            this.core.render();
        }

        this.core.updateStatus(`Updated ${property}: ${value}`);
    }

    /**
     * Update object response
     */
    updateObjectResponse(objectId, responseType, value) {
        const object = this.getObjectById(objectId);
        if (!object) return;

        object.responses[responseType] = value;
        this.core.updateStatus(`Updated ${responseType} response`);
    }

    /**
     * Update object position
     */
    updateObjectPosition(objectId, axis, value) {
        const object = this.getObjectById(objectId);
        if (!object) return;

        object.position[axis] = Math.max(0, Math.min(axis === 'x' ? 300 : 180, value));
        this.core.render();

        this.core.updateStatus(`Updated position ${axis}: ${value}`);
    }

    /**
     * Get object by ID
     */
    getObjectById(id) {
        return this.objects.find(obj => obj.id === id);
    }

    /**
     * Duplicate object
     */
    duplicateObject(objectId) {
        const object = this.getObjectById(objectId);
        if (!object) return;

        const newObject = JSON.parse(JSON.stringify(object));
        newObject.id = `object_${Date.now()}_${this.objectCounter}`;
        newObject.name = `${object.name} Copy`;
        newObject.position.x = Math.min(300, object.position.x + 20);
        newObject.position.y = Math.min(180, object.position.y + 20);

        this.addObjectToRoom(newObject);
        this.selectObject(newObject);

        this.core.updateStatus(`Duplicated object: ${newObject.name}`);
    }

    /**
     * Delete object
     */
    deleteObject(object) {
        const index = this.objects.indexOf(object);
        if (index === -1) return;

        if (confirm(`Delete object "${object.name}"? This cannot be undone.`)) {
            this.objects.splice(index, 1);

            if (this.selectedObject === object) {
                this.selectedObject = null;
                this.updatePropertiesPanel();
            }

            this.updateObjectList();
            this.core.render();

            this.core.updateStatus(`Deleted object: ${object.name}`);
        }
    }

    /**
     * Create custom object
     */
    createCustomObject() {
        const name = prompt('Enter object name:');
        if (!name) return;

        const sprite = prompt('Enter object sprite (emoji):');
        if (!sprite) return;

        const description = prompt('Enter object description:') || `A ${name.toLowerCase()}`;

        const customObject = {
            id: `custom_${Date.now()}`,
            name: name,
            description: description,
            sprite: sprite,
            takeable: true,
            combinable: true,
            category: 'Custom'
        };

        this.objectLibrary.push(customObject);
        this.updateObjectLibrary();

        this.core.updateStatus(`Added custom object: ${name}`);
    }

    /**
     * Show context menu
     */
    showContextMenu(event, object) {
        event.preventDefault();

        const existingMenu = document.querySelector('.object-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'object-context-menu';
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
                text: `✏️ Edit "${object.name}"`,
                action: () => this.selectObject(object)
            },
            {
                text: `📋 Duplicate`,
                action: () => this.duplicateObject(object.id)
            },
            { divider: true },
            {
                text: `🗑️ Delete "${object.name}"`,
                action: () => this.deleteObject(object),
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
     * Get count of objects (for room module)
     */
    getCount() {
        return this.objects.length;
    }

    /**
     * Get all objects
     */
    getAllObjects() {
        return [...this.objects];
    }

    /**
     * Clear all objects
     */
    clearAllObjects() {
        this.objects = [];
        this.selectedObject = null;
        this.hoveredObject = null;
        this.objectCounter = 0;
        this.updateObjectList();
        this.core.render();
    }

    /**
     * Set objects (for room switching)
     */
    setObjects(objects) {
        this.objects = [...objects];
        this.selectedObject = null;
        this.hoveredObject = null;
        this.updateObjectList();
        this.core.render();
    }
}

// Register the module with the core system
RetroQuest.registerModule('object', new ObjectModule());

console.log('📦 Object Module: Loaded and registered');
