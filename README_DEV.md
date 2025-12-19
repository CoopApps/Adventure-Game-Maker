# RetroQuest - Development Guide

## Project Structure

```
src/
├── main.rs              # Entry point, app setup
├── editor/              # Editor UI and logic
│   └── mod.rs          # 3-panel layout, menus, tools
├── runtime/             # Game runtime/player
│   └── mod.rs          # Game execution engine
├── systems/             # Game systems
│   ├── rpg_stats.rs    # Quest for Glory stats
│   ├── quests.rs       # Quest system
│   └── npc_ai.rs       # Virtual Theatre AI
├── resources/           # Global state
│   └── mod.rs          # ProjectState, data structures
├── ui/                  # Reusable UI components
│   └── mod.rs          # Buttons, panels, widgets
└── utils/               # Helper functions
    └── mod.rs          # Load/save, utilities
```

## Running the Editor

```bash
cargo run
```

For faster compile times with dynamic linking:
```bash
cargo run --features bevy/dynamic_linking
```

## Current Status

### ✅ Implemented
- Basic 3-panel editor layout
- Menu bar (File, Edit, View, Help)
- Project tree panel (left)
- Canvas panel (center)
- Properties panel (right)
- Status bar
- Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+Z)
- About dialog

### 📝 To Implement Next

**Phase 1 (Weeks 1-4): Core Editor**
1. File operations (New/Open/Save projects)
2. Room editor with background image import
3. Hotspot drawing tool
4. Walk area polygon tool
5. Basic property editing

**Phase 2 (Weeks 5-8): Visual Logic**
1. Condition-Action builder UI
2. Dialogue tree editor
3. Connect actions to hotspots
4. Test mode (preview game)

**Phase 3 (Weeks 9-12): Game Systems**
1. Quest for Glory stat system
2. Quest designer
3. Character editor
4. Object library

## Key Files to Know

- `src/editor/mod.rs` - Main editor UI (start here!)
- `src/resources/mod.rs` - Data structures for projects
- `Cargo.toml` - Dependencies and build config

## Development Tips

1. **Fast Iteration**: Use `cargo run` with dynamic linking enabled
2. **Hot Reload**: Bevy supports asset hot-reloading
3. **Debug UI**: Press F12 to toggle egui inspector (when enabled)
4. **Logging**: Use `info!()`, `warn!()`, `error!()` macros

## Architecture Decisions

### Why Bevy?
- Modern Rust game engine
- ECS architecture (perfect for game maker)
- Great ecosystem (bevy_egui, bevy_kira_audio)
- Cross-platform (desktop, web, mobile)
- Hot-reload support

### Why egui?
- Immediate mode UI (easy to use)
- Works great with Bevy
- Customizable, professional-looking
- Good for tool UIs

### Data Format
- Projects saved as JSON (human-readable)
- Easy to version control
- Simple to parse/modify

## Next Steps for Development

1. **Implement file operations:**
   - Use `rfd` for native file dialogs
   - Implement save/load in `src/utils/mod.rs`
   - Connect to menu buttons

2. **Add room editor:**
   - Image import for backgrounds
   - Canvas rendering
   - Zoom/pan controls

3. **Build hotspot tool:**
   - Click and drag to draw rectangles
   - Show in properties panel
   - Edit positions/sizes

4. **Create first visual logic builder:**
   - Simple IF/THEN/ELSE UI
   - Connect to hotspot interactions
   - Test with simple demo

## Questions?

See the comprehensive planning documents in the repository root:
- BEVY-REWRITE-PLAN.md
- COMPLETE-SPECIFICATION.md
- All other design docs

Happy building! 🚀
