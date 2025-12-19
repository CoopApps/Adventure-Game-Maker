/**
 * RetroQuest Game Builder - Room Module
 * Handles room creation, management, and background images
 */

class RoomModule {
    constructor() {
        this.rooms = {};
        this.currentRoomId = 1;
        this.roomCounter = 1;
        this.core = null;

        // Cache for background images to prevent flickering
        this.cachedBackgroundImage = null;

        // Initialize with default room
        this.rooms[1] = {
            id: 1,
            name: 'Room 1',
            description: 'A mysterious room filled with adventure.',
            musicTrack: '',
            backgroundImage: null,
            backgroundImageData: null,
            created: new Date().toISOString()
        };
    }

    /**
     * Initialize the room module
     */
    initialize(core) {
        console.log('🏠 Room Module: Initializing...');
        this.core = core;

        try {
            this.setupUI();
            this.updateRoomList();
            this.selectRoom(1);

            console.log('✅ Room Module: Initialized successfully');
        } catch (error) {
            console.error('❌ Room Module: Initialization failed:', error);
        }
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Room list will be updated by updateRoomList()
        // Properties panel will be updated by updatePropertiesPanel()
    }

    /**
     * Handle tool change notifications
     */
    onToolChanged(newTool, previousTool) {
        if (newTool === 'room') {
            this.updatePropertiesPanel();
        }
    }

    /**
     * Update the properties panel for room tool
     */
    updatePropertiesPanel() {
        const propertiesTitle = document.getElementById('propertiesTitle');
        const propertiesContent = document.getElementById('propertiesContent');

        if (!propertiesTitle || !propertiesContent) return;

        propertiesTitle.textContent = 'ROOM PROPERTIES';

        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        propertiesContent.innerHTML = `
            <div class="property-item">
                <label class="property-label">Room Name</label>
                <input type="text" class="property-input" value="${currentRoom.name}"
                       onchange="RetroQuest.modules.room.updateRoomProperty('name', this.value)">
            </div>

            <div class="property-item">
                <label class="property-label">Description</label>
                <textarea class="property-input" rows="3"
                          onchange="RetroQuest.modules.room.updateRoomProperty('description', this.value)">${currentRoom.description || ''}</textarea>
            </div>

            <div class="property-item">
                <label class="property-label">Music Track</label>
                <input type="text" class="property-input" value="${currentRoom.musicTrack || ''}"
                       placeholder="e.g., forest_ambience.mp3"
                       onchange="RetroQuest.modules.room.updateRoomProperty('musicTrack', this.value)">
            </div>

            <div class="property-item">
                <label class="property-label">Background Image</label>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <button onclick="RetroQuest.modules.room.uploadBackground()"
                            class="btn btn-primary" style="flex: 1;">
                        📁 Upload Image
                    </button>
                    <button onclick="RetroQuest.modules.room.clearBackground()"
                            class="btn btn-danger" style="flex: 1;">
                        🗑️ Remove
                    </button>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                    ${currentRoom.backgroundImage ?
                        `✅ Background: ${currentRoom.backgroundImage}` :
                        '📋 Drop image files onto canvas or use upload button'
                    }<br>
                    Recommended: 320x200 pixels, PNG/JPG format
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Room Statistics</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                    <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 4px; text-align: center;">
                        <div style="font-weight: bold; color: var(--hotspot-color);">${this.getHotspotCount()}</div>
                        <div style="font-size: 10px; color: var(--text-secondary);">Hotspots</div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 4px; text-align: center;">
                        <div style="font-weight: bold; color: var(--walkarea-color);">${this.getWalkAreaCount()}</div>
                        <div style="font-size: 10px; color: var(--text-secondary);">Walk Areas</div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 4px; text-align: center;">
                        <div style="font-weight: bold; color: var(--object-color);">${this.getObjectCount()}</div>
                        <div style="font-size: 10px; color: var(--text-secondary);">Objects</div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 8px; border-radius: 4px; text-align: center;">
                        <div style="font-weight: bold; color: var(--text-primary);">${this.getTotalElements()}</div>
                        <div style="font-size: 10px; color: var(--text-secondary);">Total</div>
                    </div>
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Room Actions</label>
                <div style="display: grid; gap: 4px;">
                    <button onclick="RetroQuest.modules.room.duplicateRoom()"
                            class="btn btn-primary" style="width: 100%;">
                        📋 Duplicate Room
                    </button>
                    <button onclick="RetroQuest.modules.room.createNewRoom()"
                            class="btn btn-secondary" style="width: 100%;">
                        ➕ New Room
                    </button>
                    <button onclick="RetroQuest.modules.room.deleteCurrentRoom()"
                            class="btn btn-danger" style="width: 100%;">
                        🗑️ Delete Room
                    </button>
                </div>
            </div>

            <div class="property-item">
                <label class="property-label">Canvas Settings</label>
                <div style="display: grid; gap: 4px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                        <input type="checkbox" id="room-grid" onchange="RetroQuest.toggleGrid()" ${this.core.showGrid ? 'checked' : ''}>
                        <span>Show Grid Overlay</span>
                    </label>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                        <span style="font-size: 12px;">Zoom:</span>
                        <select onchange="RetroQuest.setZoom(this.value)" class="property-input" style="flex: 1;">
                            <option value="0.5" ${this.core.zoomLevel === 0.5 ? 'selected' : ''}>50%</option>
                            <option value="1" ${this.core.zoomLevel === 1 ? 'selected' : ''}>100%</option>
                            <option value="2" ${this.core.zoomLevel === 2 ? 'selected' : ''}>200%</option>
                            <option value="4" ${this.core.zoomLevel === 4 ? 'selected' : ''}>400%</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create a new room
     */
    createNewRoom() {
        this.roomCounter++;
        const newRoomId = this.roomCounter;
        const newRoomName = `Room ${this.roomCounter}`;

        this.rooms[newRoomId] = {
            id: newRoomId,
            name: newRoomName,
            description: 'A new room waiting to be explored.',
            musicTrack: '',
            backgroundImage: null,
            backgroundImageData: null,
            created: new Date().toISOString()
        };

        this.updateRoomList();
        this.selectRoom(newRoomId);
        this.core.updateStatus(`Created new room: ${newRoomName}`);

        console.log(`🏠 Created new room: ${newRoomName} (ID: ${newRoomId})`);
    }

    /**
     * Duplicate the current room
     */
    duplicateRoom() {
        const sourceRoom = this.getCurrentRoom();
        if (!sourceRoom) return;

        this.roomCounter++;
        const newRoomId = this.roomCounter;
        const newRoomName = `${sourceRoom.name} Copy`;

        // Deep copy the room data
        this.rooms[newRoomId] = {
            id: newRoomId,
            name: newRoomName,
            description: sourceRoom.description,
            musicTrack: sourceRoom.musicTrack,
            backgroundImage: sourceRoom.backgroundImage,
            backgroundImageData: sourceRoom.backgroundImageData,
            created: new Date().toISOString()
        };

        // Copy room elements from other modules
        this.copyRoomElements(this.currentRoomId, newRoomId);

        this.updateRoomList();
        this.selectRoom(newRoomId);
        this.core.updateStatus(`Duplicated room: ${newRoomName}`);

        console.log(`🏠 Duplicated room: ${newRoomName} (ID: ${newRoomId})`);
    }

    /**
     * Delete the current room
     */
    deleteCurrentRoom() {
        if (Object.keys(this.rooms).length <= 1) {
            alert('Cannot delete the last room. At least one room is required.');
            return;
        }

        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        if (confirm(`Delete room "${currentRoom.name}"? This cannot be undone.`)) {
            delete this.rooms[this.currentRoomId];

            // Switch to first available room
            const firstRoomId = parseInt(Object.keys(this.rooms)[0]);
            this.selectRoom(firstRoomId);

            this.updateRoomList();
            this.core.updateStatus(`Deleted room: ${currentRoom.name}`);

            console.log(`🏠 Deleted room: ${currentRoom.name}`);
        }
    }

    /**
     * Copy room elements when duplicating
     */
    copyRoomElements(sourceRoomId, targetRoomId) {
        // TODO: Implement when other modules are ready
        // This will copy hotspots, walk areas, and objects
        console.log(`🏠 Copying elements from room ${sourceRoomId} to ${targetRoomId}`);
    }

    /**
     * Select a room and switch to it
     */
    selectRoom(roomId) {
        if (!this.rooms[roomId]) {
            console.error(`🏠 Room ${roomId} not found`);
            return;
        }

        console.log(`🏠 Switching to room ${roomId}`);

        // Save current room data to other modules
        this.saveCurrentRoomData();

        // Switch to new room
        this.currentRoomId = roomId;
        this.core.state.currentRoomId = roomId;

        // Clear cached background image when switching rooms
        this.cachedBackgroundImage = null;

        // Load new room data to other modules
        this.loadRoomData(roomId);

        // Update UI
        this.updateRoomList();
        this.core.render();

        // Update properties panel if room tool is active
        if (this.core.currentTool === 'room') {
            this.updatePropertiesPanel();
        }

        this.core.updateStatus(`Switched to ${this.rooms[roomId].name}`);
    }

    /**
     * Save current room data from other modules
     */
    saveCurrentRoomData() {
        // TODO: Implement when other modules are ready
        console.log(`🏠 Saving data for room ${this.currentRoomId}`);
    }

    /**
     * Load room data to other modules
     */
    loadRoomData(roomId) {
        // TODO: Implement when other modules are ready
        console.log(`🏠 Loading data for room ${roomId}`);
    }

    /**
     * Update room list in the UI
     */
    updateRoomList() {
        const roomList = document.getElementById('roomList');
        const roomCount = document.getElementById('roomCount');

        if (!roomList || !roomCount) return;

        roomCount.textContent = Object.keys(this.rooms).length;

        let html = '';
        Object.values(this.rooms).forEach(room => {
            const isSelected = room.id === this.currentRoomId;
            html += `
                <div class="list-item ${isSelected ? 'selected' : ''}"
                     onclick="RetroQuest.modules.room.selectRoom(${room.id})">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>🏠</span>
                        <span>${room.name}</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-secondary);">R${room.id}</span>
                </div>
            `;
        });

        roomList.innerHTML = html;
    }

    /**
     * Update a room property
     */
    updateRoomProperty(property, value) {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        currentRoom[property] = value;

        if (property === 'name') {
            this.updateRoomList();
        }

        this.core.updateStatus(`Updated room ${property}: ${value}`);
        console.log(`🏠 Updated room ${property}: ${value}`);
    }

    /**
     * Upload background image
     */
    uploadBackground() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            this.processBackgroundImage(file);
        };

        input.click();
    }

    /**
     * Clear background image
     */
    clearBackground() {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        if (currentRoom.backgroundImage) {
            if (confirm(`Remove background image "${currentRoom.backgroundImage}"?`)) {
                currentRoom.backgroundImage = null;
                currentRoom.backgroundImageData = null;

                // Clear cached image
                this.cachedBackgroundImage = null;

                this.core.render();

                if (this.core.currentTool === 'room') {
                    this.updatePropertiesPanel();
                }

                this.core.updateStatus('Background image removed');
            }
        } else {
            this.core.updateStatus('No background image to remove');
        }
    }

    /**
     * Process and store background image
     */
    processBackgroundImage(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Create an offscreen canvas to resize the image
                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = 320;
                offscreenCanvas.height = 200;
                const offscreenCtx = offscreenCanvas.getContext('2d');

                // Disable image smoothing for pixel art effect
                offscreenCtx.imageSmoothingEnabled = false;

                // Draw and resize the image
                offscreenCtx.drawImage(img, 0, 0, 320, 200);

                // Get the image data
                const imageData = offscreenCanvas.toDataURL('image/png');

                // Store in current room
                const currentRoom = this.getCurrentRoom();
                if (currentRoom) {
                    currentRoom.backgroundImage = file.name;
                    currentRoom.backgroundImageData = imageData;

                    // Re-render canvas with new background
                    this.core.render();

                    // Update properties panel if in room tool
                    if (this.core.currentTool === 'room') {
                        this.updatePropertiesPanel();
                    }

                    this.core.updateStatus(`Background image loaded: ${file.name}`);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Handle image drop from drag and drop
     */
    handleImageDrop(file) {
        this.processBackgroundImage(file);
    }

    /**
     * Render the background for the current room
     */
    renderBackground() {
        const currentRoom = this.getCurrentRoom();

        if (currentRoom && currentRoom.backgroundImageData) {
            // Use cached image to prevent flickering
            if (!this.cachedBackgroundImage || this.cachedBackgroundImage.src !== currentRoom.backgroundImageData) {
                this.cachedBackgroundImage = new Image();
                this.cachedBackgroundImage.onload = () => {
                    // Re-render when image loads
                    this.core.render();
                };
                this.cachedBackgroundImage.src = currentRoom.backgroundImageData;
            }

            // Only draw if image is loaded
            if (this.cachedBackgroundImage.complete) {
                // Save context settings
                this.core.ctx.save();

                // Disable image smoothing for pixel art effect
                this.core.ctx.imageSmoothingEnabled = false;

                // Draw background image
                this.core.ctx.drawImage(this.cachedBackgroundImage, 0, 0, 320, 200);

                // Restore context settings
                this.core.ctx.restore();
            }
        } else {
            // Draw default background
            this.core.ctx.fillStyle = '#2a2a2a';
            this.core.ctx.fillRect(0, 0, 320, 200);
        }
    }

    /**
     * Get the current room object
     */
    getCurrentRoom() {
        return this.rooms[this.currentRoomId] || null;
    }

    /**
     * Get hotspot count for current room
     */
    getHotspotCount() {
        if (this.core.modules.hotspot && this.core.modules.hotspot.getCount) {
            return this.core.modules.hotspot.getCount();
        }
        return 0;
    }

    /**
     * Get walk area count for current room
     */
    getWalkAreaCount() {
        if (this.core.modules.walkarea && this.core.modules.walkarea.getCount) {
            return this.core.modules.walkarea.getCount();
        }
        return 0;
    }

    /**
     * Get object count for current room
     */
    getObjectCount() {
        if (this.core.modules.object && this.core.modules.object.getCount) {
            return this.core.modules.object.getCount();
        }
        return 0;
    }

    /**
     * Get total element count for current room
     */
    getTotalElements() {
        return this.getHotspotCount() + this.getWalkAreaCount() + this.getObjectCount();
    }

    /**
     * Get all rooms (for export/save)
     */
    getAllRooms() {
        return { ...this.rooms };
    }

    /**
     * Set all rooms (for import/load)
     */
    setAllRooms(rooms) {
        this.rooms = { ...rooms };
        this.roomCounter = Math.max(...Object.keys(rooms).map(id => parseInt(id)));
        this.updateRoomList();

        // Switch to first room if current room doesn't exist
        if (!this.rooms[this.currentRoomId]) {
            const firstRoomId = parseInt(Object.keys(rooms)[0]);
            this.selectRoom(firstRoomId);
        }
    }
}

// Register the module with the core system
RetroQuest.registerModule('room', new RoomModule());

console.log('🏠 Room Module: Loaded and registered');
