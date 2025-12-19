/**
 * RetroQuest Game Builder - Character Module
 * Complete fixed version with all functionality working
 */

(function() {
    'use strict';

    console.log('🎭 Character Module: Script loading...');

    class CharacterModule {
        constructor() {
            this.name = 'character';
            this.displayName = 'Character';
            this.isActive = false;
            this.characters = [];
            this.selectedCharacter = null;
            this.nextCharacterId = 1;

            // Dragging state
            this.isDragging = false;
            this.dragOffset = null;

            // Tool settings
            this.showCharacters = true;
            this.selectedTool = null;

            console.log('🎭 Character Module: Constructor completed');
        }

        initialize(core) {
            console.log('🎭 Character Module: Initializing...');
            this.core = core;

            // Initialize game data structure
            if (!window.gameData) {
                window.gameData = {};
            }
            if (!window.gameData.rooms) {
                window.gameData.rooms = { 1: { characters: [] } };
            }

            // Load character data
            this.loadCharacterData();

            // Set up event listeners
            this.setupEventListeners();

            // Update interface
            this.updateCharacterList();

            console.log('✅ Character Module: Initialized successfully');
            return true;
        }

        activate() {
            console.log('🎭 Character Module: ACTIVATED');
            this.isActive = true;
            this.selectedCharacter = null;
            this.updatePropertiesPanel();
            this.updateStatus('Character tool selected - Click to place characters or drag from templates');
        }

        deactivate() {
            console.log('🎭 Character Module: Deactivated');
            this.isActive = false;
            this.selectedCharacter = null;
            this.isDragging = false;
        }

        loadCharacterData() {
            try {
                console.log('📁 Loading character data...');

                let data = null;

                // Check window storage
                if (window.gameData && window.gameData.characters) {
                    data = window.gameData.characters;
                }

                // Check localStorage
                if (!data) {
                    const stored = localStorage.getItem('retroquest_characters');
                    if (stored) {
                        data = JSON.parse(stored);
                    }
                }

                // Initialize empty array
                if (!data || !Array.isArray(data)) {
                    data = [];
                }

                this.characters = data;
                this.nextCharacterId = this.getNextCharacterId();

                console.log(`📁 Loaded ${this.characters.length} characters`);

                // Fix room data for existing characters
                this.fixRoomData();

            } catch (error) {
                console.warn('Character Module: Failed to load character data:', error);
                this.characters = [];
                this.nextCharacterId = 1;
            }
        }

        fixRoomData() {
            // Ensure all existing characters are in the current room
            const currentRoom = this.getCurrentRoom();
            if (currentRoom && this.characters.length > 0) {
                if (!currentRoom.characters) {
                    currentRoom.characters = [];
                }

                // Add any missing characters to room
                this.characters.forEach(character => {
                    const exists = currentRoom.characters.find(c => c.id === character.id);
                    if (!exists) {
                        currentRoom.characters.push({
                            id: character.id,
                            x: character.x || 160,
                            y: character.y || 100,
                            direction: character.direction || 'down',
                            animation: character.currentAnimation || 'idle'
                        });
                    }
                });

                console.log('🔧 Fixed room data for', currentRoom.characters.length, 'characters');
            }
        }

        saveCharacterData() {
            try {
                console.log('💾 Saving character data...');

                // Save to window storage
                if (!window.gameData) window.gameData = {};
                window.gameData.characters = this.characters;

                // Save to localStorage
                localStorage.setItem('retroquest_characters', JSON.stringify(this.characters));

                console.log(`💾 Saved ${this.characters.length} characters`);

                // Update interface
                this.updateCharacterList();

            } catch (error) {
                console.error('Character Module: Failed to save character data:', error);
            }
        }

        setupEventListeners() {
            console.log('🎧 Setting up event listeners...');

            // Listen for canvas visibility toggles
            document.addEventListener('change', (e) => {
                if (e.target.id === 'showCharacters') {
                    this.showCharacters = e.target.checked;
                    console.log('👁️ Show characters toggled:', this.showCharacters);
                    this.refreshCanvas();
                }
            });

            // Set up drag and drop
            this.setupDragAndDrop();
        }

        setupDragAndDrop() {
            console.log('🎯 Setting up drag and drop...');

            document.addEventListener('dragstart', (e) => {
                console.log('🎯 Drag started:', e.target.className);

                if (e.target.classList.contains('character-template')) {
                    const templateType = e.target.getAttribute('data-template-type');
                    console.log('🎯 Dragging template:', templateType);
                    if (templateType) {
                        e.dataTransfer.setData('text/character-template', templateType);
                        e.dataTransfer.effectAllowed = 'copy';
                    }
                }

                if (e.target.closest('[data-character-id]')) {
                    const characterElement = e.target.closest('[data-character-id]');
                    const characterId = characterElement.dataset.characterId;
                    console.log('🎯 Dragging character:', characterId);
                    e.dataTransfer.setData('text/character-id', characterId);
                    e.dataTransfer.effectAllowed = 'move';
                }
            });
        }

        getNextCharacterId() {
            if (this.characters.length === 0) return 1;
            const maxId = Math.max(...this.characters.map(c => parseInt(c.id) || 0));
            return maxId + 1;
        }

        handleCanvasDrop(e, canvasX, canvasY) {
            console.log('🎯 Canvas drop detected at:', canvasX, canvasY);

            // Check for character template drop
            const templateType = e.dataTransfer.getData('text/character-template');
            console.log('🎯 Template type from drop:', templateType);

            if (templateType) {
                console.log('🎯 Creating character from template drop:', templateType);
                this.placeCharacterAtPosition(canvasX, canvasY, templateType);
                return true;
            }

            // Check for character library item drop
            const characterId = e.dataTransfer.getData('text/character-id');
            console.log('🎯 Character ID from drop:', characterId);

            if (characterId) {
                console.log('🎯 Moving character:', characterId);
                this.updateCharacterPosition(characterId, canvasX, canvasY);
                this.selectCharacter(characterId);
                this.saveCharacterData();
                this.refreshCanvas();
                return true;
            }

            console.log('🎯 No valid drop data found');
            return false;
        }

        handleMouseDown(x, y, e) {
            console.log('🖱️ Mouse down at:', x, y, 'Tool active:', this.isActive);

            if (!this.isActive) return false;

            // Check if clicking on existing character first
            const clickedCharacter = this.getCharacterAtPosition(x, y);
            console.log('🖱️ Clicked character:', clickedCharacter?.name || 'none');

            if (clickedCharacter) {
                // Select existing character and start dragging
                this.selectCharacter(clickedCharacter.id);
                this.isDragging = true;
                this.dragOffset = {
                    x: x - clickedCharacter.x,
                    y: y - clickedCharacter.y
                };
                this.updateStatus(`Selected character: ${clickedCharacter.name} - Drag to move`);
                return true;
            }

            // If we have a selected template tool, place character
            if (this.selectedTool) {
                console.log('🖱️ Placing character with selected tool:', this.selectedTool);
                this.placeCharacterAtPosition(x, y, this.selectedTool);
                return true;
            }

            // Otherwise, show quick placement dialog
            console.log('🖱️ Showing quick placement dialog');
            this.showQuickPlacementDialog(x, y);
            return true;
        }

        handleMouseMove(x, y, e) {
            if (!this.isActive) return false;

            // Handle character dragging
            if (this.isDragging && this.selectedCharacter) {
                const newX = x - this.dragOffset.x;
                const newY = y - this.dragOffset.y;

                // Keep character within canvas bounds
                const clampedX = Math.max(16, Math.min(304, newX));
                const clampedY = Math.max(48, Math.min(200, newY));

                console.log('🖱️ Dragging character to:', clampedX, clampedY);

                // Update character position
                this.updateCharacterPosition(this.selectedCharacter.id, clampedX, clampedY);
                this.refreshCanvas();

                this.updateStatus(`Moving ${this.selectedCharacter.name} to (${Math.round(clampedX)}, ${Math.round(clampedY)})`);
                return true;
            }

            return false;
        }

        handleMouseUp(x, y, e) {
            if (!this.isActive) return false;

            if (this.isDragging) {
                console.log('🖱️ Finished dragging character');
                this.isDragging = false;
                this.dragOffset = null;

                if (this.selectedCharacter) {
                    this.updateStatus(`Moved ${this.selectedCharacter.name} to (${this.selectedCharacter.x}, ${this.selectedCharacter.y})`);
                    this.saveCharacterData();
                }
                return true;
            }

            return false;
        }

        showQuickPlacementDialog(x, y) {
            console.log('💬 Showing quick placement dialog at:', x, y);

            const templates = [
                { type: 'hero', name: 'Hero', sprite: '🧙‍♂️' },
                { type: 'heroine', name: 'Heroine', sprite: '🧙‍♀️' },
                { type: 'child', name: 'Child', sprite: '🧒' },
                { type: 'elder', name: 'Elder', sprite: '🧓' },
                { type: 'merchant', name: 'Merchant', sprite: '🧑‍💼' },
                { type: 'guard', name: 'Guard', sprite: '💂' }
            ];

            const dialog = document.createElement('div');
            dialog.className = 'character-placement-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex; align-items: center; justify-content: center;
                z-index: 10000;
            `;

            dialog.innerHTML = `
                <div style="background: var(--bg-secondary, #252526); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color, #464647); min-width: 300px;">
                    <h3 style="margin: 0 0 16px 0; color: var(--text-primary, #cccccc);">Place Character</h3>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary, #969696); font-size: 12px;">Position: (${x}, ${y})</p>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; color: var(--text-secondary, #969696); font-size: 12px;">Character Template:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            ${templates.map(template => `
                                <button class="template-button" data-template="${template.type}"
                                        style="padding: 8px; background: var(--bg-tertiary, #2d2d30); color: var(--text-primary, #cccccc); border: 1px solid var(--border-color, #464647); border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 11px;"
                                        onmouseover="this.style.borderColor='#9b59b6'"
                                        onmouseout="this.style.borderColor='var(--border-color, #464647)'">
                                    <span style="font-size: 14px;">${template.sprite}</span>
                                    ${template.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; color: var(--text-secondary, #969696); font-size: 12px;">Character Name (optional):</label>
                        <input type="text" id="characterNameInput" placeholder="Auto-generated if empty"
                               style="width: 100%; padding: 6px; background: var(--bg-tertiary, #2d2d30); color: var(--text-primary, #cccccc); border: 1px solid var(--border-color, #464647); border-radius: 4px;">
                    </div>

                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button onclick="this.closest('.character-placement-dialog').remove()"
                                style="padding: 6px 12px; background: var(--bg-tertiary, #2d2d30); color: var(--text-primary, #cccccc); border: 1px solid var(--border-color, #464647); border-radius: 4px; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            `;

            // Add event listeners for template buttons
            dialog.addEventListener('click', (e) => {
                if (e.target.classList.contains('template-button') || e.target.closest('.template-button')) {
                    const button = e.target.closest('.template-button') || e.target;
                    const templateType = button.dataset.template;
                    const customName = dialog.querySelector('#characterNameInput').value.trim() || null;

                    console.log('💬 Dialog template selected:', templateType, customName);

                    this.placeCharacterAtPosition(x, y, templateType);
                    if (customName && this.selectedCharacter) {
                        this.updateProperty('name', customName);
                    }

                    dialog.remove();
                }
            });

            document.body.appendChild(dialog);
        }

        placeCharacterAtPosition(x, y, templateType) {
            console.log('🎨 Placing character at:', x, y, 'with template:', templateType);

            const character = this.createCharacter(templateType, x, y);
            if (character) {
                console.log('🎨 Character created successfully:', character);
                this.selectCharacter(character.id);
                this.selectedTool = null;
                this.refreshCanvas();
                this.updateStatus(`Placed ${character.name} at (${x}, ${y})`);
            } else {
                console.error('🎨 Failed to create character');
            }
        }

        createCharacter(templateType = 'hero', x = 160, y = 100, customName = null) {
            console.log('🏭 Creating character:', { templateType, x, y, customName });

            const template = this.getTemplate(templateType);
            if (!template) {
                console.error('Character Module: Unknown template type:', templateType);
                return null;
            }

            console.log('🏭 Using template:', template);

            // Create character data
            const character = {
                id: this.nextCharacterId.toString(),
                name: customName || `${template.name} ${this.nextCharacterId}`,
                type: template.type,
                sprite: template.sprite,
                x: Math.round(x),
                y: Math.round(y),
                width: 32,
                height: 48,
                walkSpeed: template.walkSpeed,
                runSpeed: template.runSpeed,
                frameRate: template.frameRate,
                direction: 'down',
                currentAnimation: 'idle',
                spriteSheetData: null,
                animations: {
                    idle: { frames: 1, loop: true, speed: 1000 },
                    walk: { frames: template.defaultFrames, loop: true, speed: 200 },
                    run: { frames: template.defaultFrames, loop: true, speed: 100 }
                },
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };

            console.log('🏭 Created character object:', character);

            // Add to character list
            this.characters.push(character);
            this.nextCharacterId++;

            // Add to current room - FIXED VERSION
            this.addCharacterToCurrentRoom(character);

            // Save data
            this.saveCharacterData();

            console.log(`🏭 Character created: "${character.name}" at (${x}, ${y})`);

            return character;
        }

        getTemplate(type) {
            const templates = [
                {
                    name: 'Hero',
                    type: 'hero',
                    description: 'Main character hero',
                    sprite: '🧙‍♂️',
                    walkSpeed: 120,
                    runSpeed: 200,
                    frameRate: 8,
                    color: '#4a90e2',
                    defaultFrames: 4
                },
                {
                    name: 'Heroine',
                    type: 'heroine',
                    description: 'Main character heroine',
                    sprite: '🧙‍♀️',
                    walkSpeed: 110,
                    runSpeed: 180,
                    frameRate: 8,
                    color: '#e24a90',
                    defaultFrames: 4
                },
                {
                    name: 'Child',
                    type: 'child',
                    description: 'Young character',
                    sprite: '🧒',
                    walkSpeed: 90,
                    runSpeed: 150,
                    frameRate: 10,
                    color: '#50c878',
                    defaultFrames: 3
                },
                {
                    name: 'Elder',
                    type: 'elder',
                    description: 'Wise elder character',
                    sprite: '🧓',
                    walkSpeed: 80,
                    runSpeed: 120,
                    frameRate: 6,
                    color: '#8b7355',
                    defaultFrames: 3
                },
                {
                    name: 'Merchant',
                    type: 'merchant',
                    description: 'Shop keeper or trader',
                    sprite: '🧑‍💼',
                    walkSpeed: 70,
                    runSpeed: 110,
                    frameRate: 6,
                    color: '#ffa500',
                    defaultFrames: 3
                },
                {
                    name: 'Guard',
                    type: 'guard',
                    description: 'Armored guard',
                    sprite: '💂',
                    walkSpeed: 90,
                    runSpeed: 140,
                    frameRate: 7,
                    color: '#dc143c',
                    defaultFrames: 4
                }
            ];

            const template = templates.find(t => t.type === type) || templates[0];
            console.log('🎯 Found template:', template);
            return template;
        }

        addCharacterToCurrentRoom(character) {
            console.log('🏠 FIXED: Adding character to current room:', character.id);

            const currentRoom = this.getCurrentRoom();
            console.log('🏠 FIXED: Current room:', currentRoom);

            if (currentRoom) {
                if (!currentRoom.characters) {
                    currentRoom.characters = [];
                    console.log('🏠 FIXED: Created characters array in room');
                }

                // Check if character already exists in room
                const existsIndex = currentRoom.characters.findIndex(c => c.id === character.id);

                const roomCharacter = {
                    id: character.id,
                    x: character.x,
                    y: character.y,
                    direction: character.direction || 'down',
                    animation: character.currentAnimation || 'idle'
                };

                if (existsIndex !== -1) {
                    // Update existing
                    currentRoom.characters[existsIndex] = roomCharacter;
                    console.log('🏠 FIXED: Updated existing character in room:', roomCharacter);
                } else {
                    // Add new
                    currentRoom.characters.push(roomCharacter);
                    console.log('🏠 FIXED: Added new character to room:', roomCharacter);
                }

                console.log('🏠 FIXED: Room now has', currentRoom.characters.length, 'characters');
            } else {
                console.warn('🏠 FIXED: No current room found!');
            }
        }

        getCurrentRoom() {
            console.log('🏠 Getting current room...');

            // Initialize game data if needed
            if (!this.core) {
                console.warn('🏠 No core available');
                // Try to use global gameData
                if (!window.gameData) {
                    window.gameData = { rooms: { 1: { characters: [] } } };
                }
                return window.gameData.rooms[1];
            }

            if (!this.core.gameData) {
                this.core.gameData = { rooms: { 1: { characters: [] } } };
            }

            if (!this.core.gameData.rooms) {
                this.core.gameData.rooms = { 1: { characters: [] } };
            }

            // Return first room
            const roomKeys = Object.keys(this.core.gameData.rooms);
            if (roomKeys.length > 0) {
                const room = this.core.gameData.rooms[roomKeys[0]];
                console.log('🏠 Found room:', room);
                return room;
            }

            console.warn('🏠 No rooms found!');
            return null;
        }

        getCharactersInCurrentRoom() {
            console.log('👥 Getting characters in current room...');

            const currentRoom = this.getCurrentRoom();
            if (!currentRoom || !currentRoom.characters || currentRoom.characters.length === 0) {
                console.log('👥 No room characters, using main array as fallback');
                // Return main characters array as fallback
                return this.characters.filter(c => c.x !== undefined && c.y !== undefined);
            }

            console.log('👥 Room characters:', currentRoom.characters);

            // Map room character data to full character objects
            const roomCharacters = currentRoom.characters.map(roomChar => {
                const character = this.characters.find(c => c.id === roomChar.id);
                if (character) {
                    const fullChar = {
                        ...character,
                        x: roomChar.x,
                        y: roomChar.y,
                        direction: roomChar.direction || character.direction,
                        currentAnimation: roomChar.animation || character.currentAnimation
                    };
                    console.log('👥 Mapped character:', fullChar);
                    return fullChar;
                }
                console.warn('👥 Character not found:', roomChar.id);
                return null;
            }).filter(c => c !== null);

            console.log('👥 Final room characters:', roomCharacters);
            return roomCharacters;
        }

        getCharacterAtPosition(x, y) {
            // Check all characters directly, not just room characters
            console.log('🎯 Checking position', x, y, 'against', this.characters.length, 'total characters');

            for (const character of this.characters) {
                if (character.x !== undefined && character.y !== undefined) {
                    const width = character.width || 32;
                    const height = character.height || 48;

                    // Check if point is within character bounds
                    const left = character.x - width / 2;
                    const right = character.x + width / 2;
                    const top = character.y - height;
                    const bottom = character.y;

                    if (x >= left && x <= right && y >= top && y <= bottom) {
                        console.log('🎯 Found character at position:', character);
                        return character;
                    }
                }
            }

            console.log('🎯 No character found at position');
            return null;
        }

        render(ctx) {
            console.log('🎨 Character render called, showCharacters:', this.showCharacters);

            if (!this.showCharacters) {
                console.log('🎨 Characters hidden, skipping render');
                return;
            }

            // Render ALL characters from main array (ignore room system for rendering)
            console.log('🎨 Rendering all characters directly from main array');

            this.characters.forEach((character, index) => {
                if (character.x !== undefined && character.y !== undefined) {
                    console.log(`🎨 Rendering character ${index}:`, character.name, 'at', character.x, character.y);
                    this.renderCharacter(ctx, character);
                }
            });
        }

        renderCharacter(ctx, character) {
            console.log('🖼️ Rendering character:', character.name, 'at', character.x, character.y);

            const x = character.x;
            const y = character.y;
            const width = character.width || 32;
            const height = character.height || 48;
            const isSelected = this.selectedCharacter && this.selectedCharacter.id === character.id;

            // Save context state
            ctx.save();

            try {
                // Draw character shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.ellipse(x, y, width * 0.4, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Draw character body
                const template = this.getTemplate(character.type);
                const bodyColor = template.color || '#9b59b6';

                // Character body
                ctx.fillStyle = bodyColor;
                ctx.fillRect(x - width/2, y - height, width, height);

                // Character border
                ctx.strokeStyle = isSelected ? '#ffff00' : 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = isSelected ? 3 : 1;
                ctx.strokeRect(x - width/2, y - height, width, height);

                // Draw character emoji/sprite in center
                ctx.fillStyle = '#ffffff';
                ctx.font = `${Math.min(width * 0.6, 20)}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(character.sprite, x, y - height/2);

                // Draw character name below
                ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(character.name, x, y + 4);

                // Draw selection indicator
                if (isSelected) {
                    ctx.strokeStyle = '#ffff00';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(x - width/2 - 4, y - height - 4, width + 8, height + 8);
                    ctx.setLineDash([]);
                }

                console.log('🖼️ Successfully rendered character');

            } catch (error) {
                console.error('🖼️ Error rendering character:', error);
            }

            // Restore context state
            ctx.restore();
        }

        updateCharacterPosition(characterId, x, y) {
            console.log('📍 Updating character position:', characterId, 'to', x, y);

            // Update in main character array
            const character = this.characters.find(c => c.id === characterId);
            if (character) {
                character.x = Math.round(x);
                character.y = Math.round(y);
                character.modified = new Date().toISOString();
            }

            // Update in current room
            const currentRoom = this.getCurrentRoom();
            if (currentRoom && currentRoom.characters) {
                const roomCharacter = currentRoom.characters.find(c => c.id === characterId);
                if (roomCharacter) {
                    roomCharacter.x = Math.round(x);
                    roomCharacter.y = Math.round(y);
                } else {
                    // Add to room if not there
                    if (character) {
                        currentRoom.characters.push({
                            id: characterId,
                            x: Math.round(x),
                            y: Math.round(y),
                            direction: character.direction || 'down',
                            animation: character.currentAnimation || 'idle'
                        });
                    }
                }
            }

            // Update properties panel if this character is selected
            if (this.selectedCharacter && this.selectedCharacter.id === characterId) {
                this.updatePropertiesPanel();
            }
        }

        selectCharacter(characterId) {
            this.selectedCharacter = this.characters.find(c => c.id === characterId);

            if (this.selectedCharacter) {
                console.log(`✅ Selected character: "${this.selectedCharacter.name}"`);
                this.updateCharacterList();
                this.updatePropertiesPanel();
                this.refreshCanvas();
            }
        }

        updateCharacterList() {
            const characterList = document.getElementById('characterList');
            const characterCount = document.getElementById('characterCount');

            if (!characterList || !characterCount) return;

            characterCount.textContent = this.characters.length;

            if (this.characters.length === 0) {
                characterList.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: var(--text-secondary); font-style: italic; font-size: 11px;">
                        No characters created yet
                    </div>
                `;
                return;
            }

            characterList.innerHTML = this.characters.map(character => `
                <div class="list-item ${this.selectedCharacter?.id === character.id ? 'selected' : ''}"
                     onclick="window.RetroQuest?.modules?.character?.selectCharacter('${character.id}')"
                     data-character-id="${character.id}"
                     draggable="true"
                     style="cursor: grab;"
                     ondragstart="event.dataTransfer.setData('text/character-id', '${character.id}'); event.dataTransfer.effectAllowed = 'move'; this.style.opacity='0.5';"
                     ondragend="this.style.opacity='1';">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">${character.sprite}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 500; font-size: 12px;">${character.name}</div>
                            <div style="font-size: 10px; color: var(--text-secondary);">${character.type} • (${character.x}, ${character.y})</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        updatePropertiesPanel() {
            const content = document.getElementById('propertiesContent');
            const title = document.getElementById('propertiesTitle');

            if (!content || !title) return;

            title.textContent = 'CHARACTER TOOL';

            if (this.selectedCharacter) {
                this.renderSelectedCharacterProperties(content);
            } else {
                this.renderCharacterToolProperties(content);
            }
        }

        renderCharacterToolProperties(content) {
            const templates = [
                { type: 'hero', name: 'Hero', sprite: '🧙‍♂️', description: 'Main character hero' },
                { type: 'heroine', name: 'Heroine', sprite: '🧙‍♀️', description: 'Main character heroine' },
                { type: 'child', name: 'Child', sprite: '🧒', description: 'Young character' },
                { type: 'elder', name: 'Elder', sprite: '🧓', description: 'Wise elder character' },
                { type: 'merchant', name: 'Merchant', sprite: '🧑‍💼', description: 'Shop keeper or trader' },
                { type: 'guard', name: 'Guard', sprite: '💂', description: 'Armored guard' }
            ];

            content.innerHTML = `
                <div class="property-item">
                    <label class="property-label">Character Tool</label>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
                        Click on canvas to place characters, or drag templates/characters below.
                    </p>
                </div>

                <div class="property-item">
                    <label class="property-label">Character Templates</label>
                    <div style="display: grid; gap: 6px; max-height: 200px; overflow-y: auto;">
                        ${templates.map(template => `
                            <div class="character-template"
                                 draggable="true"
                                 data-template-type="${template.type}"
                                 onclick="window.RetroQuest?.modules?.character?.selectTemplate('${template.type}')"
                                 style="padding: 8px; background: var(--bg-tertiary); border-radius: 4px; cursor: grab; display: flex; align-items: center; gap: 8px; border: 1px solid transparent; transition: all 0.2s;"
                                 onmouseover="this.style.borderColor='#9b59b6'; this.style.background='var(--bg-hover)'"
                                 onmouseout="this.style.borderColor='transparent'; this.style.background='var(--bg-tertiary)'"
                                 ondragstart="event.dataTransfer.setData('text/character-template', '${template.type}'); event.dataTransfer.effectAllowed = 'copy';">
                                <span style="font-size: 18px;">${template.sprite}</span>
                                <div>
                                    <div style="font-weight: 500; font-size: 12px;">${template.name}</div>
                                    <div style="font-size: 10px; color: var(--text-secondary);">${template.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="property-item">
                    <label class="property-label">Character Library (${this.characters.length})</label>
                    <div style="max-height: 150px; overflow-y: auto;">
                        ${this.characters.length === 0 ?
                            '<div style="padding: 12px; text-align: center; color: var(--text-secondary); font-style: italic; font-size: 11px;">No characters created</div>' :
                            this.characters.map(char => `
                                <div class="list-item"
                                     draggable="true"
                                     data-character-id="${char.id}"
                                     onclick="window.RetroQuest?.modules?.character?.selectCharacter('${char.id}')"
                                     style="margin: 4px 0; cursor: grab;"
                                     ondragstart="event.dataTransfer.setData('text/character-id', '${char.id}'); event.dataTransfer.effectAllowed = 'move'; this.style.opacity='0.5';"
                                     ondragend="this.style.opacity='1';">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-size: 14px;">${char.sprite}</span>
                                        <div>
                                            <div style="font-size: 11px; font-weight: 500;">${char.name}</div>
                                            <div style="font-size: 9px; color: var(--text-secondary);">${char.type}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>

                <div class="property-item">
                    <label class="property-label">Quick Actions</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                        <button onclick="window.RetroQuest?.modules?.character?.quickCreate('hero')" style="font-size: 10px; padding: 4px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; color: var(--text-primary);">+ Hero</button>
                        <button onclick="window.RetroQuest?.modules?.character?.quickCreate('merchant')" style="font-size: 10px; padding: 4px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; color: var(--text-primary);">+ Merchant</button>
                        <button onclick="window.RetroQuest?.modules?.character?.quickCreate('guard')" style="font-size: 10px; padding: 4px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; color: var(--text-primary);">+ Guard</button>
                        <button onclick="window.RetroQuest?.modules?.character?.quickCreate('child')" style="font-size: 10px; padding: 4px 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; color: var(--text-primary);">+ Child</button>
                    </div>
                </div>

                <div class="property-item" style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
                    <label class="property-label">Debug Info</label>
                    <div style="font-size: 10px; color: var(--text-secondary);">
                        <div>Characters: ${this.characters.length}</div>
                        <div>Tool Active: ${this.isActive ? 'Yes' : 'No'}</div>
                        <div>Show Characters: ${this.showCharacters ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            `;
        }

        renderSelectedCharacterProperties(content) {
            const char = this.selectedCharacter;

            content.innerHTML = `
                <div class="property-item">
                    <label class="property-label">Selected Character</label>
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-tertiary); border-radius: 6px; border: 2px solid #9b59b6;">
                        <div style="font-size: 32px;">${char.sprite}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">${char.name}</div>
                            <div style="font-size: 11px; color: var(--text-secondary);">${char.type} • (${char.x}, ${char.y})</div>
                        </div>
                    </div>
                </div>

                <div class="property-item">
                    <label class="property-label">Character Name</label>
                    <input type="text" value="${char.name}"
                           onchange="window.RetroQuest?.modules?.character?.updateProperty('name', this.value)"
                           style="width: 100%; padding: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-primary);">
                </div>

                <div class="property-item">
                    <label class="property-label">Position</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <input type="number" value="${char.x}"
                               onchange="window.RetroQuest?.modules?.character?.updateProperty('x', parseInt(this.value))"
                               style="text-align: center; padding: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-primary);">
                        <input type="number" value="${char.y}"
                               onchange="window.RetroQuest?.modules?.character?.updateProperty('y', parseInt(this.value))"
                               style="text-align: center; padding: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-primary);">
                    </div>
                </div>

                <div class="property-item">
                    <label class="property-label">Actions</label>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="window.RetroQuest?.modules?.character?.deleteCharacter()"
                                style="padding: 6px 12px; background: #f48771; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>

                <div class="property-item">
                    <button onclick="window.RetroQuest?.modules?.character?.deselectCharacter()"
                            style="width: 100%; padding: 8px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; color: var(--text-primary);">
                        ← Back to Character Tool
                    </button>
                </div>
            `;
        }

        quickCreate(templateType) {
            console.log('⚡ Quick creating character:', templateType);
            const character = this.createCharacter(templateType);
            if (character) {
                this.selectCharacter(character.id);
                this.refreshCanvas();
            }
        }

        selectTemplate(templateType) {
            console.log('🎯 Template selected:', templateType);
            this.selectedTool = templateType;
            this.updateStatus(`${this.getTemplate(templateType).name} selected - Click on canvas to place`);
        }

        updateProperty(property, value) {
            if (!this.selectedCharacter) return;

            console.log('📝 Updating property:', property, '=', value);

            if (property === 'x' || property === 'y') {
                this.updateCharacterPosition(this.selectedCharacter.id,
                    property === 'x' ? value : this.selectedCharacter.x,
                    property === 'y' ? value : this.selectedCharacter.y);
            } else {
                this.selectedCharacter[property] = value;
                this.selectedCharacter.modified = new Date().toISOString();
            }

            this.saveCharacterData();
            this.refreshCanvas();
        }

        deselectCharacter() {
            console.log('❌ Deselecting character');
            this.selectedCharacter = null;
            this.updateCharacterList();
            this.updatePropertiesPanel();
            this.refreshCanvas();
        }

        deleteCharacter() {
            if (!this.selectedCharacter) return;

            if (confirm(`Delete character "${this.selectedCharacter.name}"?`)) {
                console.log('🗑️ Deleting character:', this.selectedCharacter.name);

                // Remove from characters array
                const index = this.characters.findIndex(c => c.id === this.selectedCharacter.id);
                if (index !== -1) {
                    this.characters.splice(index, 1);
                }

                // Remove from current room
                const currentRoom = this.getCurrentRoom();
                if (currentRoom && currentRoom.characters) {
                    const roomIndex = currentRoom.characters.findIndex(c => c.id === this.selectedCharacter.id);
                    if (roomIndex !== -1) {
                        currentRoom.characters.splice(roomIndex, 1);
                    }
                }

                this.selectedCharacter = null;
                this.saveCharacterData();
                this.updatePropertiesPanel();
                this.refreshCanvas();
            }
        }

        refreshCanvas() {
            console.log('🔄 Refreshing canvas...');
            if (this.core && this.core.render) {
                this.core.render();
            }
        }

        updateStatus(message) {
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = message;
                console.log('📢 Status:', message);
            }
        }

        // Public API for other modules
        getCharacters() {
            return [...this.characters];
        }

        getCharacterById(id) {
            return this.characters.find(c => c.id === id);
        }
    }

    // Register the module when RetroQuest system is available
    function registerCharacterModule() {
        console.log('📝 Attempting to register character module...');

        if (typeof window.RetroQuest !== 'undefined' && window.RetroQuest.registerModule) {
            const characterModule = new CharacterModule();
            window.RetroQuest.registerModule('character', characterModule);
            console.log('✅ Character Module: Registered with RetroQuest system');
        } else {
            console.log('⏳ Character Module: Waiting for RetroQuest system...');
            setTimeout(registerCharacterModule, 100);
        }
    }

    // Start registration process
    registerCharacterModule();

    console.log('🎭 Character Module: Script loaded completely');

})();
