# RetroQuest - Bevy Rewrite Plan
## No-Code Point-and-Click Adventure Game Maker

---

## Research: Adventure Game Studio Analysis

### What AGS Requires

Based on research from the [AGS Manual](https://adventuregamestudio.github.io/ags-manual/), [AGS Wiki](https://www.adventuregamestudio.co.uk/wiki/Scripting,_Code_&_Interaction), and community resources:

**Coding Requirements in AGS:**
- ✅ **Basic interactions:** Can be done without code using event system
- ❌ **Advanced features require scripting:**
  - Cutscenes
  - Complex dialogue trees
  - Inventory combinations
  - Custom game logic
  - Character AI/pathfinding tweaks

**AGS Scripting Language:**
- C-like syntax (variables, functions, if/else, loops)
- Example interaction code:
```c
function hDoor_Interact() {
    if (player.HasInventory(iKey)) {
        player.Say("The key fits!");
        hDoor.Enabled = false;
        player.ChangeRoom(2, 100, 100);
    } else {
        player.Say("It's locked.");
    }
}
```

**What Users Need to Know:**
- Variables and data types (int, string, bool)
- Conditional logic (if/else)
- Functions and parameters
- Object properties and methods
- Basic programming concepts

### No-Code Alternatives

**[Visionaire Studio](https://www.visionaire-studio.net/)** - Truly no-code:
- Visual action sequences
- Drag-and-drop logic
- No scripting required for full games

**[Adventure Creator](https://adventurecreator.org/)** (Unity) - Optional coding:
- ActionList system (visual scripting)
- Node-based logic
- Code only needed for advanced custom features

**[001 Game Creator](https://001gamecreator.com/wiki/pnc/)** - No code templates:
- Pre-built templates
- Visual event system
- Point-and-click kit included

---

## The Zero-Code Challenge

### What Needs Visual Systems (No Code):

1. **Hotspot Interactions**
   - Current: `if (condition) { action }`
   - **Solution:** Visual condition-action builder

2. **Dialogue Trees**
   - Current: Script with branching logic
   - **Solution:** Node-based dialogue editor

3. **Inventory Logic**
   - Current: Item combination scripts
   - **Solution:** Visual recipe/combination system

4. **Character Behavior**
   - Current: Script character movements and actions
   - **Solution:** Timeline/sequence editor

5. **Game Logic**
   - Current: Variables, flags, conditionals
   - **Solution:** Visual state machine editor

6. **Cutscenes**
   - Current: Scripted sequences
   - **Solution:** Timeline editor with keyframes

---

## Architecture: RetroQuest Bevy Edition

### Core Philosophy

**Zero-Code Principle:** Every feature that requires scripting in AGS must have a visual alternative in RetroQuest.

### Tech Stack

```
Editor (Bevy + egui):
├── Bevy 0.14 (game engine)
├── egui (immediate mode UI)
├── bevy_egui (integration)
├── serde (serialization)
└── rfd (file dialogs)

Player Runtime (Bevy):
├── Bevy 0.14 (cross-platform)
├── JSON game data
└── Compiled to: Windows, Mac, Linux, WASM, iOS, Android
```

---

## Feature Design: Visual Systems

### 1. Hotspot Interaction Builder

**Visual interface replacing code:**

```
┌─────────────────────────────────────────┐
│  Hotspot: "Locked Door"                 │
├─────────────────────────────────────────┤
│  On Interact:                           │
│  ┌────────────────────────────────────┐ │
│  │ IF Player has "Key"                │ │
│  │   ├─ Say "The key fits!"           │ │
│  │   ├─ Disable "Locked Door"         │ │
│  │   └─ Go to Room "Hallway" at (50,100) │
│  │ ELSE                               │ │
│  │   └─ Say "It's locked."            │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [+ Add Condition]  [+ Add Action]     │
└─────────────────────────────────────────┘
```

**Implementation:**
- Drag-and-drop condition blocks
- Dropdown menus for actions
- No typing required (except dialogue text)
- Preview system shows execution flow

### 2. Dialogue Node Editor

**Visual replacement for dialogue scripts:**

```
        ┌─────────────┐
        │ "Hello!"    │
        │ - Player    │
        └──────┬──────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼───┐      ┌────▼────┐
   │"Who   │      │"Goodbye"│
   │ are   │      │ - Player│
   │ you?" │      └────┬────┘
   │-Player│           │
   └───┬───┘      ┌────▼────┐
       │          │[End]    │
   ┌───▼───┐      └─────────┘
   │"I'm   │
   │Guard" │
   │- NPC  │
   └───────┘
```

**Features:**
- Node-based graph editor
- Drag to connect nodes
- Conditions on branches (has item, flag set, etc.)
- Voice/text preview

### 3. Inventory Combination System

**Visual recipe builder:**

```
┌─────────────────────────────────────────┐
│  Inventory Combinations                 │
├─────────────────────────────────────────┤
│  [Key] + [Lock] = [Unlocked Door]      │
│  ├─ Remove: Key, Lock                  │
│  ├─ Add: Unlocked Door                 │
│  └─ Message: "You unlock the door!"    │
│                                         │
│  [Rope] + [Hook] = [Grappling Hook]    │
│  └─ ...                                │
│                                         │
│  [+ Add Combination]                   │
└─────────────────────────────────────────┘
```

**Implementation:**
- Visual item picker
- Result configuration
- No scripting needed

### 4. Character Behavior Sequences

**Timeline editor for actions:**

```
Time: 0s ────────────────────────── 10s
      │                              │
NPC1  ├─ Walk(50,100) ─┬─ Say("Hi")─┤
      0s               5s            10s

Player│────────────────┬─ Say("Hello")
                       5s
```

**Features:**
- Drag keyframes on timeline
- Actions: Walk, Talk, Animate, Wait
- Parallel execution supported
- Loop/repeat options

### 5. Visual State Machine

**Game logic without code:**

```
┌──────────┐  Key Found   ┌─────────────┐
│ Locked   ├─────────────>│ Unlocked    │
│ Door     │              │ Door        │
└──────────┘              └─────┬───────┘
                                │ Interact
                          ┌─────▼───────┐
                          │ Door Open   │
                          │ → Room 2    │
                          └─────────────┘
```

**Implementation:**
- Visual state graph
- Transitions with conditions
- Actions on state enter/exit
- Global and per-object states

### 6. Cutscene Timeline Editor

**Visual sequence builder:**

```
┌────────────────────────────────────────────┐
│ Cutscene: "Opening Scene"                  │
├────────────────────────────────────────────┤
│ 0:00  Camera: Fade from black              │
│ 0:02  Camera: Pan to door                  │
│ 0:04  Player: Walk to (100, 80)           │
│ 0:06  NPC: Say "Welcome!"                  │
│ 0:08  Player: Say "Thanks!"                │
│ 0:10  Camera: Fade to black                │
├────────────────────────────────────────────┤
│ [+ Add Event] [Preview] [Play]            │
└────────────────────────────────────────────┘
```

**Features:**
- Timeline with events
- Drag events to reorder
- Preview playback
- Camera controls

---

## UI/UX Design

### Main Editor Window

```
┌──────────────────────────────────────────────────────┐
│ File  Edit  View  Tools  Build  Help         [■][□][×]│
├─────┬────────────────────────────────────────┬────────┤
│TREE │         CANVAS VIEWPORT                │PROPS   │
│     │  ┌──────────────────────────┐         │        │
│Rooms│  │                          │         │Hotspot │
│ ├Room│  │   [320×200 Canvas]      │         │Properties│
│ └─···│  │                          │         │        │
│Chars│  └──────────────────────────┘         │Name:   │
│ ├Hero│  [Zoom: 100%] [Grid] [Snap]         │"Door"  │
│ └─···│                                       │        │
│Items│  [Room] [Hotspot] [Walk] [Object]    │Interaction│
│ ├Key │  [Character] [Sequence] [Test]      │Builder │
│ └─···│                                       │[+Cond] │
├─────┴────────────────────────────────────────┴────────┤
│ Status: Ready | Autosave: On | FPS: 60               │
└──────────────────────────────────────────────────────┘
```

### Key Panels

**Project Tree** (Left):
- Hierarchical organization
- Drag-and-drop reordering
- Right-click context menus
- Search/filter

**Canvas Viewport** (Center):
- Retro 320×200 or custom resolution
- Zoom (25% to 400%)
- Grid overlay with snap
- Multi-layer rendering
- Onion skinning for animation

**Properties Panel** (Right):
- Context-sensitive
- Changes based on selection
- Visual builders embedded
- Live preview

**Bottom Panel** (Collapsible):
- Console/log
- Asset browser
- Animation timeline
- Dialogue editor

---

## Data Model

### Game Project Structure

```
RetroQuest Project (.rqp)
├── project.json          # Project metadata
├── rooms/
│   ├── room_01.json     # Room data
│   ├── room_02.json
│   └── ...
├── characters/
│   ├── hero.json        # Character definitions
│   ├── guard.json
│   └── ...
├── items/
│   ├── key.json         # Inventory items
│   └── ...
├── dialogues/
│   ├── intro.json       # Dialogue trees
│   └── ...
├── sequences/
│   ├── opening.json     # Cutscenes/sequences
│   └── ...
├── logic/
│   ├── states.json      # State machines
│   └── combinations.json # Inventory recipes
└── assets/
    ├── sprites/
    ├── backgrounds/
    ├── sounds/
    └── music/
```

### Example: Hotspot Data (JSON)

```json
{
  "id": "hotspot_door_001",
  "name": "Locked Door",
  "polygon": [[100,50], [140,50], [140,130], [100,130]],
  "interactions": {
    "look": {
      "type": "sequence",
      "actions": [
        {"type": "say", "character": "player", "text": "A locked door."}
      ]
    },
    "interact": {
      "type": "conditional",
      "condition": {
        "type": "has_item",
        "item_id": "key_rusty"
      },
      "if_true": [
        {"type": "say", "character": "player", "text": "The key fits!"},
        {"type": "play_sound", "sound": "unlock.wav"},
        {"type": "set_hotspot_enabled", "hotspot_id": "hotspot_door_001", "enabled": false},
        {"type": "change_room", "room_id": "room_hallway", "x": 50, "y": 100}
      ],
      "if_false": [
        {"type": "say", "character": "player", "text": "It's locked."}
      ]
    }
  }
}
```

**Key Point:** This JSON is **generated** by the visual editor. Users never see it!

---

## Implementation Roadmap

### Phase 1: Core Editor (Months 1-2)

**Milestone 1.1: Basic UI** (Week 1-2)
- [ ] Bevy + egui setup
- [ ] Main window layout (3-panel)
- [ ] Project tree component
- [ ] Canvas viewport with zoom
- [ ] Properties panel framework
- [ ] File menu (New, Open, Save, Export)

**Milestone 1.2: Room Editor** (Week 3-4)
- [ ] Create/delete rooms
- [ ] Background image import
- [ ] Room properties (name, size, music)
- [ ] Room switching
- [ ] Canvas grid and snap

**Milestone 1.3: Hotspot Drawing** (Week 5-6)
- [ ] Polygon drawing tool
- [ ] Freehand tool
- [ ] Rectangle/circle tools
- [ ] Hotspot visualization (colors, outlines)
- [ ] Hotspot list in tree
- [ ] Basic properties editing

**Milestone 1.4: Walk Areas** (Week 7-8)
- [ ] Polygon tool for walk areas
- [ ] Walk area visualization
- [ ] Enable/disable areas
- [ ] Walkable vs walk-behind types
- [ ] Validation (minimum 3 points)

### Phase 2: Visual Logic Systems (Months 3-4)

**Milestone 2.1: Interaction Builder** (Week 9-10)
- [ ] Condition-action block system
- [ ] Drag-and-drop interface
- [ ] Condition types:
  - [ ] Has item
  - [ ] Flag set/unset
  - [ ] Variable comparison
  - [ ] Room visited
  - [ ] Character present
- [ ] Action types:
  - [ ] Say dialogue
  - [ ] Give/take item
  - [ ] Change room
  - [ ] Play sound/music
  - [ ] Enable/disable hotspot
  - [ ] Set flag/variable
  - [ ] Start sequence

**Milestone 2.2: Dialogue Editor** (Week 11-12)
- [ ] Node graph system (using egui_node_graph or custom)
- [ ] Speech nodes (character + text)
- [ ] Choice nodes (player options)
- [ ] Condition nodes (branching)
- [ ] Action nodes (give item, set flag)
- [ ] Connection lines
- [ ] Auto-layout algorithm
- [ ] Export to JSON

**Milestone 2.3: Inventory System** (Week 13-14)
- [ ] Item library
- [ ] Item properties (sprite, name, description, takeable)
- [ ] Combination builder UI
- [ ] Result configuration
- [ ] Item categories
- [ ] Drag-and-drop combinations

**Milestone 2.4: State Machine Editor** (Week 15-16)
- [ ] Visual state graph
- [ ] State nodes
- [ ] Transition arrows
- [ ] Condition editor for transitions
- [ ] Actions on state enter/exit
- [ ] Global game states
- [ ] Per-object states

### Phase 3: Characters & Objects (Month 5)

**Milestone 3.1: Character System** (Week 17-18)
- [ ] Character library
- [ ] Sprite import (static or animated)
- [ ] Animation frames editor
- [ ] Walk speed, talk color
- [ ] Default position per room
- [ ] Character placement tool

**Milestone 3.2: Object System** (Week 19-20)
- [ ] Object library
- [ ] Object placement tool
- [ ] Drag from library to canvas
- [ ] Layering (z-order)
- [ ] Hotspot linking
- [ ] Visible/hidden states

### Phase 4: Advanced Features (Month 6)

**Milestone 4.1: Sequence/Cutscene Editor** (Week 21-22)
- [ ] Timeline UI
- [ ] Event types:
  - [ ] Character movement
  - [ ] Dialogue
  - [ ] Camera control
  - [ ] Wait/delay
  - [ ] Parallel actions
- [ ] Keyframe system
- [ ] Preview playback
- [ ] Loop/repeat options

**Milestone 4.2: Testing & Preview** (Week 23-24)
- [ ] Game preview mode
- [ ] Play from current room
- [ ] Interaction testing
- [ ] Debug overlay (hotspots, walk areas)
- [ ] Console for testing
- [ ] Quick restart

### Phase 5: Game Runtime (Months 7-8)

**Milestone 5.1: Bevy Runtime Core** (Week 25-28)
- [ ] JSON game data loader
- [ ] Room rendering system
- [ ] Hotspot interaction system
- [ ] Character system (ECS)
- [ ] Walk area pathfinding
- [ ] Click-to-walk implementation
- [ ] Camera system

**Milestone 5.2: Runtime Features** (Week 29-32)
- [ ] Dialogue system
- [ ] Inventory UI
- [ ] Item combinations
- [ ] Save/load system
- [ ] State machine execution
- [ ] Sequence player
- [ ] Audio system (music, SFX)

### Phase 6: Export & Distribution (Month 9)

**Milestone 6.1: Build System** (Week 33-34)
- [ ] Windows build
- [ ] Mac build
- [ ] Linux build
- [ ] WASM/web build
- [ ] Asset bundling
- [ ] Game icon/metadata

**Milestone 6.2: Distribution** (Week 35-36)
- [ ] Installer creation
- [ ] itch.io export
- [ ] Steam export (if applicable)
- [ ] Android APK (stretch)
- [ ] iOS build (stretch)

---

## Zero-Code Feature Comparison

| Feature | AGS (Requires Code) | RetroQuest (Visual) |
|---------|---------------------|---------------------|
| Basic hotspot interaction | ✅ Event system | ✅ Interaction builder |
| Complex conditionals | ❌ Must script | ✅ Visual condition blocks |
| Dialogue trees | ❌ Must script | ✅ Node editor |
| Inventory combinations | ❌ Must script | ✅ Recipe builder |
| Cutscenes | ❌ Must script | ✅ Timeline editor |
| Character AI | ❌ Must script | ✅ Sequence editor |
| Game logic/flags | ❌ Variables in code | ✅ Visual state machine |
| Custom interactions | ❌ Must script | ✅ Action blocks |

**Result:** RetroQuest requires **ZERO** coding for features that need scripting in AGS.

---

## Bevy-Specific Advantages

### Why Bevy is Perfect for This

1. **ECS Architecture**
   - Clean separation of data and logic
   - Perfect for game entities (characters, objects, hotspots)
   - Easy to serialize/deserialize

2. **Cross-Platform**
   - Desktop (Windows, Mac, Linux)
   - Web (WASM)
   - Mobile (iOS, Android)
   - Consoles (possible)

3. **Built-in Systems**
   - Asset loading
   - Audio
   - Rendering (2D sprites)
   - Input handling
   - Transform hierarchy

4. **egui Integration**
   - Immediate mode UI (perfect for editors)
   - Fast development
   - Rich widgets
   - Custom rendering

5. **Performance**
   - Native speed
   - Proper game loop
   - Multi-threading
   - Efficient rendering

6. **Rust Benefits**
   - Memory safety
   - No garbage collection
   - Great tooling (cargo)
   - Strong type system

---

## Example: Bevy ECS for Game Runtime

```rust
// Hotspot component
#[derive(Component)]
struct Hotspot {
    polygon: Vec<Vec2>,
    interaction: Interaction,
}

// Interaction definition
#[derive(Clone)]
enum Interaction {
    Sequence(Vec<Action>),
    Conditional {
        condition: Condition,
        if_true: Vec<Action>,
        if_false: Vec<Action>,
    },
}

// Game runtime system
fn handle_hotspot_clicks(
    mut commands: Commands,
    mouse: Res<MouseInput>,
    hotspots: Query<(&Hotspot, &Transform)>,
    player: Query<&Player>,
) {
    if mouse.just_pressed(MouseButton::Left) {
        let click_pos = get_world_mouse_position();

        for (hotspot, transform) in hotspots.iter() {
            if point_in_polygon(click_pos, &hotspot.polygon) {
                execute_interaction(&hotspot.interaction, &player);
            }
        }
    }
}
```

**Key Point:** The runtime **executes** the visual data. No scripting in game files!

---

## Development Estimates

### Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Core Editor | 2 months | Room editor, hotspots, walk areas |
| Visual Logic | 2 months | Interaction builder, dialogue editor, state machines |
| Characters & Objects | 1 month | Full character/object system |
| Advanced Features | 1 month | Sequences, cutscenes, preview |
| Game Runtime | 2 months | Playable game engine |
| Export & Polish | 1 month | Multi-platform builds |
| **Total** | **9 months** | Production-ready tool |

### Team Size vs Timeline

- **Solo developer:** 9-12 months
- **2 developers:** 6-8 months
- **3-4 developers:** 4-6 months

### Effort Breakdown

```
Total: ~1,800-2,400 hours

Editor UI:              500 hours (28%)
Visual Logic Systems:   600 hours (33%)
Game Runtime:           400 hours (22%)
Testing & Polish:       300 hours (17%)
```

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Bevy learning curve | High | Medium | Use tutorials, community support |
| egui limitations | Medium | Medium | Fallback: iced or custom UI |
| WASM performance | Low | Low | Optimize assets, lazy loading |
| Mobile support complexity | Medium | Low | Focus on desktop first |
| Save/load corruption | Medium | High | Extensive testing, version migration |

### Scope Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Feature creep | High | High | Strict MVP definition, phased approach |
| Timeline overrun | Medium | Medium | Buffer time, cut non-essential features |
| User confusion (too complex) | Medium | High | User testing, tutorials, examples |

---

## Success Criteria

### MVP (Minimum Viable Product)

A successful v1.0 must allow users to create a complete point-and-click adventure game **without writing any code**, including:

- ✅ Multiple rooms with backgrounds
- ✅ Hotspots with interactions
- ✅ Walk areas for character movement
- ✅ Inventory items and combinations
- ✅ Dialogue conversations
- ✅ Basic cutscenes
- ✅ Game save/load
- ✅ Export to playable game (Windows, Mac, Linux, Web)

### Success Metrics

- **User can create first game:** < 2 hours (tutorial)
- **Feature parity with AGS:** 80% without code, 95% with visual systems
- **Export success rate:** > 95% (games build without errors)
- **Performance:** 60fps on 5-year-old hardware
- **Cross-platform:** Works on Windows, Mac, Linux, Web

---

## Comparison: Current JS vs Bevy Rewrite

| Aspect | Current (JS) | Bevy Rewrite |
|--------|--------------|--------------|
| **Code completeness** | 70% | Start fresh |
| **Time to MVP** | 20-40 hours (fix) | 6-9 months |
| **Coding required** | Yes (properties, logic) | ZERO |
| **Visual scripting** | None | Full suite |
| **Game export** | Manual HTML | Native builds |
| **Performance** | Browser-limited | Native speed |
| **Cross-platform** | Web only | Desktop, web, mobile |
| **Learning value** | Fix JS architecture | Learn Rust + Bevy |
| **Long-term potential** | Limited | Unlimited |

---

## Recommendation

### Choose Bevy Rewrite If:

✅ You want **zero coding** for end users
✅ You want to **learn Rust/Bevy** (valuable skill)
✅ You have **6-9 months** to invest
✅ You want **native desktop games** (not just web)
✅ You want **professional-grade** tool
✅ You value **clean architecture** over quick fixes
✅ You want to **compete** with AGS, Visionaire, etc.

### Stick with JS Fix If:

✅ You need something **working in 2-4 weeks**
✅ You're okay with **some coding** for advanced features
✅ You want **web-only** games (browser-based)
✅ You want to **validate the idea** before big investment

---

## Next Steps

If you decide to proceed with Bevy rewrite:

### Week 1: Setup & Prototyping
1. Set up Rust + Bevy development environment
2. Create basic egui window
3. Prototype 3-panel layout
4. Experiment with canvas rendering
5. Test polygon drawing

### Week 2: Core Architecture
1. Design ECS component structure
2. Set up project serialization (JSON)
3. Implement basic room system
4. File save/load infrastructure
5. Asset management system

### Week 3-4: First Milestone
1. Working room editor
2. Background image import
3. Hotspot drawing tool
4. Basic properties panel
5. **Deliverable:** Can create rooms and draw hotspots

**From there, follow the 9-month roadmap above.**

---

## Sources & Research

This plan is based on research from:

- [Adventure Game Studio Manual](https://adventuregamestudio.github.io/ags-manual/) - Scripting requirements
- [AGS Wiki - Scripting](https://www.adventuregamestudio.co.uk/wiki/Scripting,_Code_&_Interaction) - Code examples
- [Visionaire Studio](https://www.visionaire-studio.net/) - No-code visual scripting approach
- [Adventure Creator](https://adventurecreator.org/) - Visual ActionList system
- [Game Engines for Point-and-Click](https://www.slant.co/topics/5145/~game-engines-for-point-click-adventure-games) - Comparison
- [Beginner's Guide to AGS](https://rpgmaker.net/tutorials/314/) - User perspective on coding needs

---

## Conclusion

**The Bevy rewrite is ambitious but achievable.** The key innovation is **eliminating ALL coding through visual systems** - something even AGS requires for advanced features.

**Timeline:** 6-9 months to production-ready tool
**Effort:** ~2,000 hours of focused development
**Result:** Professional no-code adventure game maker with native cross-platform support

**Ready to start?** Let me know and I'll help you with:
1. Development environment setup
2. First prototype (3-panel editor)
3. Detailed weekly task breakdown
4. Architecture design documents

The choice is yours! 🚀
