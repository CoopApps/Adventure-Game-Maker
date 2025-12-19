/**
 * RetroQuest Game Builder - Test Game Module
 * Complete rewrite for proper functionality
 */

class TestGameModule {
    constructor() {
        this.previewWindow = null;
    }

    /**
     * Initialize the test game module
     */
    initialize(core) {
        console.log('🎮 Test Game Module: Initializing...');
        this.core = core;

        // Add test button to toolbar after a short delay
        setTimeout(() => this.addTestButton(), 200);

        console.log('✅ Test Game Module: Initialized successfully');
    }

    /**
     * Add test button to existing toolbar
     */
    addTestButton() {
        const toolbar = document.querySelector('.toolbar');
        if (!toolbar) {
            console.warn('Toolbar not found, retrying...');
            setTimeout(() => this.addTestButton(), 500);
            return;
        }

        // Add separator
        const separator = document.createElement('div');
        separator.className = 'toolbar-separator';
        toolbar.appendChild(separator);

        // Add test button
        const testButton = document.createElement('button');
        testButton.className = 'tool-button test-button';
        testButton.onclick = () => this.launchTest();
        testButton.innerHTML = `
            <svg viewBox="0 0 16 16">
                <polygon points="3,2 3,14 13,8" fill="currentColor"/>
            </svg>
            Test Game
        `;

        toolbar.appendChild(testButton);
        console.log('✅ Test Game button added to toolbar');
    }

    /**
     * Launch the test game preview
     */
    launchTest() {
        console.log('🎮 Launching RetroQuest Game Preview...');

        // Gather data from all available sources
        const gameData = this.gatherGameData();

        // Store data globally for preview window to access
        window.testGameData = gameData;

        // Open preview window
        this.previewWindow = window.open(
            'about:blank',
            'RetroQuestPreview',
            'width=800,height=600,resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no'
        );

        if (!this.previewWindow) {
            alert('Failed to open preview window. Please allow popups for this site.');
            return;
        }

        // Write the preview HTML to the new window
        this.previewWindow.document.write(this.getPreviewHTML());
        this.previewWindow.document.close();

        console.log('✅ Preview window opened successfully');
    }

    /**
     * Gather data from all available sources
     */
    gatherGameData() {
        const data = {
            currentRoom: { name: 'Test Room' },
            background: null,
            hotspots: [],
            walkAreas: [],
            objects: []
        };

        try {
            // Try to get background from multiple sources
            if (window.gameData?.rooms?.[1]?.backgroundImageData) {
                data.background = window.gameData.rooms[1].backgroundImageData;
                data.currentRoom.name = 'Room 1';
            }

            // Try to get data from RetroQuest modules if available
            if (typeof RetroQuest !== 'undefined' && RetroQuest.modules) {
                // Get hotspots
                if (RetroQuest.modules.hotspot && RetroQuest.modules.hotspot.getAllHotspots) {
                    data.hotspots = RetroQuest.modules.hotspot.getAllHotspots() || [];
                }

                // Get walk areas
                if (RetroQuest.modules.walkarea && RetroQuest.modules.walkarea.getAllWalkAreas) {
                    data.walkAreas = RetroQuest.modules.walkarea.getAllWalkAreas() || [];
                }

                // Get objects
                if (RetroQuest.modules.object && RetroQuest.modules.object.getAllObjects) {
                    data.objects = RetroQuest.modules.object.getAllObjects() || [];
                }

                // Get room data
                if (RetroQuest.modules.room && RetroQuest.modules.room.getCurrentRoom) {
                    const roomData = RetroQuest.modules.room.getCurrentRoom();
                    if (roomData) {
                        data.currentRoom = roomData;
                        if (roomData.backgroundImageData) {
                            data.background = roomData.backgroundImageData;
                        }
                    }
                }
            }

            console.log('📊 Game data gathered:', {
                room: data.currentRoom.name,
                background: !!data.background,
                hotspots: data.hotspots.length,
                walkAreas: data.walkAreas.length,
                objects: data.objects.length
            });

        } catch (error) {
            console.warn('⚠️ Error gathering game data:', error);
        }

        // If no content, create test data
        if (data.hotspots.length === 0 && data.walkAreas.length === 0 && data.objects.length === 0) {
            this.addTestData(data);
        }

        return data;
    }

    /**
     * Add test data when no content exists
     */
    addTestData(data) {
        // Add test hotspots
        data.hotspots = [
            {
                id: 'test1',
                name: 'Door',
                path: [
                    {x: 100, y: 50}, {x: 140, y: 50},
                    {x: 140, y: 130}, {x: 100, y: 130}
                ],
                responses: { look: "It's a sturdy wooden door with iron hinges." },
                fillColor: 'rgba(255, 107, 107, 0.4)',
                strokeColor: 'rgba(255, 107, 107, 0.8)'
            },
            {
                id: 'test2',
                name: 'Window',
                path: [
                    {x: 200, y: 60}, {x: 280, y: 60},
                    {x: 280, y: 100}, {x: 200, y: 100}
                ],
                responses: { look: "Through the window, you can see the garden outside." },
                fillColor: 'rgba(107, 255, 107, 0.4)',
                strokeColor: 'rgba(107, 255, 107, 0.8)'
            }
        ];

        // Add default walk area
        data.walkAreas = [
            {
                id: 'defaultWalk',
                name: 'Floor',
                enabled: true,
                points: [
                    {x: 20, y: 140}, {x: 300, y: 140},
                    {x: 300, y: 190}, {x: 20, y: 190}
                ]
            }
        ];

        console.log('📝 Added test data for preview');
    }

    /**
     * Generate the preview HTML
     */
    getPreviewHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RetroQuest Game Preview</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #1a1a1a;
            color: #ffffff;
            font-family: 'Courier New', monospace;
            overflow: hidden;
            user-select: none;
        }

        .preview-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            background: #1a1a1a;
        }

        .game-viewport {
            position: relative;
            border: 2px solid #555;
            background: #000;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }

        #gameCanvas {
            display: block;
            background: #2a2a2a;
            cursor: crosshair;
        }

        .message-box {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ffffff;
            padding: 12px;
            min-height: 40px;
            color: #ffffff;
            font-size: 14px;
            font-family: 'Courier New', monospace;
            display: none;
            z-index: 100;
        }

        .message-text {
            margin: 0;
            line-height: 1.4;
        }

        .close-hint {
            position: absolute;
            bottom: 4px;
            right: 8px;
            font-size: 10px;
            color: #888;
        }

        .character-sprite {
            position: absolute;
            width: 16px;
            height: 20px;
            background: #ffff00;
            border: 1px solid #cccc00;
            border-radius: 2px;
            transition: all 0.3s ease;
            z-index: 50;
            pointer-events: none;
        }

        .character-sprite::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 8px;
            height: 8px;
            background: #ffffff;
            border-radius: 50%;
        }

        .character-sprite::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 6px;
            background: #dddd00;
            border-radius: 2px;
        }

        .exit-hint {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #ffffff;
            padding: 8px 12px;
            font-size: 12px;
            border: 1px solid #555;
            border-radius: 4px;
            z-index: 200;
        }

        .debug-info {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 8px;
            font-size: 11px;
            border: 1px solid #333;
            border-radius: 4px;
            z-index: 200;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="game-viewport">
            <canvas id="gameCanvas" width="320" height="200"></canvas>

            <!-- Character sprite -->
            <div id="characterSprite" class="character-sprite" style="display: none;"></div>

            <!-- Message box -->
            <div id="messageBox" class="message-box">
                <p id="messageText" class="message-text"></p>
                <div class="close-hint">Click to close</div>
            </div>
        </div>

        <!-- Exit hint -->
        <div class="exit-hint">Press ESC to return to editor</div>

        <!-- Debug info -->
        <div class="debug-info" id="debugInfo">
            Loading...
        </div>
    </div>

    <script>
        class RetroQuestPreview {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.ctx.imageSmoothingEnabled = false;

                this.messageBox = document.getElementById('messageBox');
                this.messageText = document.getElementById('messageText');
                this.characterSprite = document.getElementById('characterSprite');
                this.debugInfo = document.getElementById('debugInfo');

                // Game state
                this.gameData = null;
                this.character = { x: 160, y: 100, visible: false };
                this.messageVisible = false;
                this.hoveredElement = null;

                this.setupEventListeners();
                this.loadGameData();
                this.render();
            }

            setupEventListeners() {
                this.canvas.addEventListener('click', (e) => this.handleClick(e));
                this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                this.messageBox.addEventListener('click', () => this.hideMessage());
                document.addEventListener('keydown', (e) => this.handleKeyDown(e));
                this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            }

            loadGameData() {
                if (window.opener && window.opener.testGameData) {
                    this.gameData = window.opener.testGameData;
                    console.log('📦 Loaded game data:', this.gameData);
                } else {
                    console.warn('No game data found from editor');
                    this.gameData = { currentRoom: { name: 'No Data' }, hotspots: [], walkAreas: [], objects: [], background: null };
                }
                this.updateDebugInfo();
            }

            updateDebugInfo() {
                const roomName = this.gameData?.currentRoom?.name || 'Unknown';
                const hotspots = this.gameData?.hotspots?.length || 0;
                const walkAreas = this.gameData?.walkAreas?.length || 0;
                const objects = this.gameData?.objects?.length || 0;
                const hasBackground = !!this.gameData?.background;
                const characterStatus = this.character.visible ?
                    'X:' + this.character.x + ' Y:' + this.character.y : 'Hidden';

                this.debugInfo.innerHTML =
                    'Room: ' + roomName + '<br>' +
                    'BG: ' + (hasBackground ? 'Yes' : 'No') + ' | H:' + hotspots + ' W:' + walkAreas + ' O:' + objects + '<br>' +
                    'Character: ' + characterStatus;
            }

            handleClick(e) {
                if (this.messageVisible) {
                    this.hideMessage();
                    return;
                }

                const coords = this.getCanvasCoordinates(e);

                // Check for hotspot clicks
                const clickedHotspot = this.getHotspotAtPoint(coords);
                if (clickedHotspot) {
                    this.showMessage(clickedHotspot.responses?.look || 'You examine the ' + clickedHotspot.name + '.');
                    return;
                }

                // Check for object clicks
                const clickedObject = this.getObjectAtPoint(coords);
                if (clickedObject) {
                    this.showMessage(clickedObject.description || 'You see a ' + clickedObject.name + '.');
                    return;
                }

                // Try to move character
                if (this.isPointWalkable(coords)) {
                    this.moveCharacterTo(coords.x, coords.y);
                } else {
                    this.showMessage("I can't walk there.");
                }
            }

            handleMouseMove(e) {
                if (this.messageVisible) return;

                const coords = this.getCanvasCoordinates(e);

                // Check what's under cursor
                const hoveredHotspot = this.getHotspotAtPoint(coords);
                const hoveredObject = this.getObjectAtPoint(coords);
                const hoveredElement = hoveredHotspot || hoveredObject;

                // Update cursor
                if (hoveredElement) {
                    this.canvas.style.cursor = 'pointer';
                } else {
                    const isWalkable = this.isPointWalkable(coords);
                    this.canvas.style.cursor = isWalkable ? 'crosshair' : 'not-allowed';
                }

                // Update hover state
                if (hoveredElement !== this.hoveredElement) {
                    this.hoveredElement = hoveredElement;
                    this.render();
                }
            }

            handleKeyDown(e) {
                if (e.key === 'Escape') {
                    this.returnToEditor();
                }
            }

            getCanvasCoordinates(e) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;

                return {
                    x: Math.floor((e.clientX - rect.left) * scaleX),
                    y: Math.floor((e.clientY - rect.top) * scaleY)
                };
            }

            getHotspotAtPoint(point) {
                if (!this.gameData?.hotspots) return null;

                for (let i = this.gameData.hotspots.length - 1; i >= 0; i--) {
                    const hotspot = this.gameData.hotspots[i];
                    if (hotspot.path && this.pointInPolygon(point, hotspot.path)) {
                        return hotspot;
                    }
                }
                return null;
            }

            getObjectAtPoint(point) {
                if (!this.gameData?.objects) return null;

                for (let i = this.gameData.objects.length - 1; i >= 0; i--) {
                    const obj = this.gameData.objects[i];
                    const width = obj.width || 32;
                    const height = obj.height || 32;
                    if (point.x >= obj.x && point.x <= obj.x + width &&
                        point.y >= obj.y && point.y <= obj.y + height) {
                        return obj;
                    }
                }
                return null;
            }

            isPointWalkable(point) {
                const walkAreas = this.gameData?.walkAreas;

                // If no walk areas, allow walking anywhere
                if (!walkAreas || walkAreas.length === 0) {
                    return true;
                }

                // Check if point is in any walkable area
                for (const walkArea of walkAreas) {
                    if (walkArea.enabled !== false && walkArea.points && walkArea.points.length >= 3) {
                        if (this.pointInPolygon(point, walkArea.points)) {
                            return true;
                        }
                    }
                }

                return false;
            }

            pointInPolygon(point, polygon) {
                if (!polygon || polygon.length < 3) return false;

                let inside = false;
                for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                    if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
                        (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) /
                         (polygon[j].y - polygon[i].y) + polygon[i].x)) {
                        inside = !inside;
                    }
                }
                return inside;
            }

            moveCharacterTo(x, y) {
                this.character.x = x;
                this.character.y = y;
                this.character.visible = true;

                this.characterSprite.style.left = (x - 8) + 'px';
                this.characterSprite.style.top = (y - 20) + 'px';
                this.characterSprite.style.display = 'block';

                this.updateDebugInfo();
            }

            showMessage(text) {
                this.messageText.textContent = text;
                this.messageBox.style.display = 'block';
                this.messageVisible = true;
            }

            hideMessage() {
                this.messageBox.style.display = 'none';
                this.messageVisible = false;
            }

            render() {
                this.ctx.clearRect(0, 0, 320, 200);
                this.drawBackground();

                if (!this.messageVisible) {
                    this.drawWalkAreas();
                    this.drawObjects();
                    this.drawHotspots();
                }
            }

            drawBackground() {
                if (this.gameData?.background) {
                    const img = new Image();
                    img.onload = () => {
                        this.ctx.drawImage(img, 0, 0, 320, 200);
                        if (!this.messageVisible) {
                            this.drawWalkAreas();
                            this.drawObjects();
                            this.drawHotspots();
                        }
                    };
                    img.src = this.gameData.background;
                } else {
                    // Default background
                    const gradient = this.ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, '#4a4a4a');
                    gradient.addColorStop(1, '#2a2a2a');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(0, 0, 320, 200);
                    this.drawSimpleRoom();
                }
            }

            drawSimpleRoom() {
                this.ctx.save();

                // Floor
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.fillRect(0, 150, 320, 50);

                // Wall line
                this.ctx.strokeStyle = '#555555';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(0, 150);
                this.ctx.lineTo(320, 150);
                this.ctx.stroke();

                // Simple furniture
                this.ctx.strokeStyle = '#666666';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(100, 50, 40, 80); // Door
                this.ctx.strokeRect(200, 60, 80, 40); // Window
                this.ctx.strokeRect(50, 80, 40, 70);  // Bookshelf

                this.ctx.restore();
            }

            drawWalkAreas() {
                if (!this.gameData?.walkAreas) return;

                this.gameData.walkAreas.forEach(walkArea => {
                    if (!walkArea.points || walkArea.points.length < 3) return;

                    this.ctx.save();
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.15)';
                    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
                    this.ctx.lineWidth = 1;

                    this.ctx.beginPath();
                    this.ctx.moveTo(walkArea.points[0].x, walkArea.points[0].y);
                    for (let i = 1; i < walkArea.points.length; i++) {
                        this.ctx.lineTo(walkArea.points[i].x, walkArea.points[i].y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.restore();
                });
            }

            drawObjects() {
                if (!this.gameData?.objects) return;

                this.gameData.objects.forEach(obj => {
                    const isHovered = this.hoveredElement === obj;

                    this.ctx.save();
                    this.ctx.fillStyle = isHovered ? '#ffff00' : '#ff8800';
                    this.ctx.strokeStyle = '#cc6600';
                    this.ctx.lineWidth = isHovered ? 2 : 1;

                    const width = obj.width || 32;
                    const height = obj.height || 32;

                    this.ctx.fillRect(obj.x, obj.y, width, height);
                    this.ctx.strokeRect(obj.x, obj.y, width, height);

                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = '10px monospace';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(obj.name || 'Object', obj.x + width/2, obj.y + height/2 + 3);

                    this.ctx.restore();
                });
            }

            drawHotspots() {
                if (!this.gameData?.hotspots) return;

                this.gameData.hotspots.forEach(hotspot => {
                    if (!hotspot.path || hotspot.path.length < 3) return;

                    const isHovered = this.hoveredElement === hotspot;

                    this.ctx.save();
                    this.ctx.fillStyle = isHovered ?
                        hotspot.fillColor?.replace('0.4', '0.6') || 'rgba(255, 107, 107, 0.6)' :
                        hotspot.fillColor || 'rgba(255, 107, 107, 0.4)';
                    this.ctx.strokeStyle = hotspot.strokeColor || 'rgba(255, 107, 107, 0.8)';
                    this.ctx.lineWidth = isHovered ? 2 : 1;

                    this.ctx.beginPath();
                    this.ctx.moveTo(hotspot.path[0].x, hotspot.path[0].y);
                    for (let i = 1; i < hotspot.path.length; i++) {
                        this.ctx.lineTo(hotspot.path[i].x, hotspot.path[i].y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.restore();
                });
            }

            returnToEditor() {
                if (window.opener) {
                    window.opener.focus();
                    window.close();
                } else {
                    alert('No editor window found. Close this window manually.');
                }
            }
        }

        // Initialize when page loads
        window.addEventListener('load', () => {
            new RetroQuestPreview();
        });
    </script>
</body>
</html>`;
    }
}

// Register the module
if (typeof RetroQuest !== 'undefined' && RetroQuest.registerModule) {
    RetroQuest.registerModule('testgame', new TestGameModule());
} else {
    console.log('🎮 Test Game Module: Loaded (waiting for RetroQuest core)');
}

console.log('🎮 Test Game Module: Ready');
