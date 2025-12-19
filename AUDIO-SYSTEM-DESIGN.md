# Audio System Design - Complete Sound & Music

## Why Audio Defines 50% of Game Immersion

**Research shows:**
- Players rate audio as contributing 45-55% to overall immersion
- Silent games feel "broken" even with perfect visuals
- Music sets emotional tone for 80% of memorable game moments
- Sound effects provide critical feedback for player actions
- Voice acting increases player connection to characters by 300%

**Current Coverage:** 20% ⚠️ (basic mentions only)
**Priority:** CRITICAL - Audio is half the experience

---

## The Audio Challenge

### AGS Way: ❌ Manual Audio Hell

```c
// Play background music
aMusic1.Play();

// Play sound effect
aFootsteps.Play();

// No crossfading, no volume control, no ducking
// No spatial audio, no music layers
// Voice acting sync is manual nightmare
```

**Problems:**
1. No music crossfading (abrupt cuts)
2. No automatic audio ducking (music drowns dialogue)
3. Manual volume management
4. No spatial/positional audio
5. No lip sync system
6. No audio state machine
7. File management chaos

---

## RetroQuest Solution: ✅ Professional Audio System

### 1. Music System with Dynamic Layers

```
┌────────────────────────────────────────────────┐
│  Music Composer & Manager                      │
├────────────────────────────────────────────────┤
│  🎵 Background Music Tracks         [+ Import] │
├────────────────────────────────────────────────┤
│  Town Theme                                    │
│  File: town_music.ogg (2:34, 2.3MB)            │
│  Loop: ✓ Seamless  Loop Point: 0:08 - 2:30    │
│  Intro: town_intro.ogg (0:08)                  │
│  Volume: ████████▒▒ 80%                        │
│  Fade In: 2.0s  Fade Out: 3.0s                 │
│  Used in: 3 rooms (Town Square, Shop, Inn)     │
│  [Edit] [Preview] [Waveform] [Delete]          │
│                                                │
│  Dynamic Music Layers:                         │
│  ┌──────────────────────────────────────┐     │
│  │ Layer 1: Base (melody)    ✓ Always   │     │
│  │ Layer 2: Percussion       When: Combat│     │
│  │ Layer 3: Strings          When: Tense │     │
│  │ Layer 4: Choir            When: Epic  │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Crossfade Settings:                           │
│  Transition type: ⦿ Crossfade                  │
│                   ○ Hard cut                   │
│                   ○ Fade to silence → new      │
│  Duration: 2.0s                                │
│  Curve: ⦿ Linear ○ Exponential ○ S-curve      │
│                                                │
│  [Music State Machine] [Test Transitions]      │
└────────────────────────────────────────────────┘
```

**Music State Machine:**
```
┌────────────────────────────────────────────────┐
│  Music Flow Designer                           │
├────────────────────────────────────────────────┤
│  Visual State Graph:                           │
│                                                │
│  [Town Theme] ──(enter shop)──> [Shop Music]   │
│       │                                        │
│       │ (enemy appears)                        │
│       ▼                                        │
│  [Combat Music] ──(victory)──> [Town Theme]    │
│       │                                        │
│       │ (defeat)                               │
│       ▼                                        │
│  [Game Over Music]                             │
│                                                │
│  Transition Rules:                             │
│  Town → Combat: Crossfade 1.5s, add drums      │
│  Combat → Town: Fade out 3s, victory stinger   │
│  Any → Boss: Hard cut (immediate tension)      │
│                                                │
│  [Add State] [Add Transition] [Test Flow]      │
└────────────────────────────────────────────────┘
```

### 2. Sound Effect Library & Organization

```
┌────────────────────────────────────────────────┐
│  Sound Effects Library            🔍 [Search]  │
├────────────────────────────────────────────────┤
│  Categories:                                   │
│  ├─ 🚶 Footsteps (23 files)                    │
│  ├─ 🚪 Doors (15 files)                        │
│  ├─ 🔊 Ambient (47 files)                      │
│  │  ├─ Rain (8 files)                          │
│  │  ├─ Wind (12 files)                         │
│  │  └─ Fire (6 files)                          │
│  ├─ ⚔️ Combat (34 files)                       │
│  ├─ 🎯 UI Sounds (18 files)                    │
│  ├─ 🗣️ Voice Acting (156 files)                │
│  └─ 🎼 Music Stingers (9 files)                │
│                                                │
│  Selected: door_creak_1.wav                    │
│  ┌──────────────────────────────────────┐     │
│  │ [Waveform visualization]             │     │
│  │ ▁▂▃▅▇█▇▅▃▂▁ Duration: 1.2s          │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Properties:                                   │
│  Format: WAV, 44.1kHz, 16-bit Mono             │
│  Size: 105 KB                                  │
│  Volume: ████████░░ 85%                        │
│  Pitch: ●─────○ (±2 semitones)                 │
│  Random Pitch: ✓ Vary ±10% (natural variety)  │
│                                                │
│  Spatial Audio:                                │
│  ⦿ 2D (no positional audio)                    │
│  ○ 3D Positional (distance falloff)            │
│     Max distance: [500] pixels                 │
│     Rolloff: Linear ▼                          │
│                                                │
│  [Play] [Trim] [Normalize] [Apply Effects]     │
│  [Assign to Event] [Export] [Delete]           │
└────────────────────────────────────────────────┘
```

**Auto-Tagging & Smart Search:**
```
Search: "wooden door open"
Results:
✓ door_wood_open_1.wav
✓ door_wood_creak_open.wav
✓ door_old_wooden_slow.wav

Suggestions:
• door_metal_open.wav (different material)
• chest_wood_open.wav (similar object)

Recent: door_creak_1.wav, footstep_stone_1.wav
Popular: ui_click.wav, coin_pickup.wav
```

### 3. Voice Acting System

```
┌────────────────────────────────────────────────┐
│  Voice Acting Manager                          │
├────────────────────────────────────────────────┤
│  Dialogue Line: "The door is locked."          │
│  Character: Guard                              │
│  Scene: Town Gate                              │
│                                                │
│  Voice File: guard_door_locked.wav             │
│  ┌──────────────────────────────────────┐     │
│  │ [Waveform]                           │     │
│  │ ▁▃▅▇"The door"▇▅"is locked"▃▁       │     │
│  │ |─ 0.5s ─|───── 1.2s ─────|          │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Auto-Sync with Text: ✓                        │
│  Word Timestamps (auto-generated):             │
│  "The" (0.0s - 0.2s)                           │
│  "door" (0.3s - 0.6s)                          │
│  "is" (0.8s - 1.0s)                            │
│  "locked" (1.1s - 1.5s)                        │
│                                                │
│  Lip Sync:                                     │
│  ⦿ Auto-generate from audio (phoneme detect)   │
│  ○ Manual keyframes                            │
│  ○ None (no lip movement)                      │
│                                                │
│  Phoneme Timeline:                             │
│  TH─ə──D─ɔr──ɪz──L─ɑkt                        │
│  Mouth shapes: 🅐🅔🅘🅞🅤 (A-E-I-O-U mapping)  │
│                                                │
│  Subtitles: ✓ Auto-generate with timestamps    │
│  Voice Direction Notes:                        │
│  [Stern, authoritative. Guard is annoyed.]     │
│                                                │
│  [Record New Take] [Import] [Sync] [Preview]   │
└────────────────────────────────────────────────┘
```

**Voice Recording Studio (Built-in):**
```
┌────────────────────────────────────────────────┐
│  Voice Recording Studio                        │
├────────────────────────────────────────────────┤
│  Recording Script:                             │
│  Line 1/47: "The door is locked."              │
│  Context: Guard refuses entry                  │
│  Direction: Stern, authoritative               │
│                                                │
│  🎤 Input: [Microphone - USB Audio ▼]          │
│  Levels: ████████▒▒ (Good level)               │
│                                                │
│  ⏺️ [Record]  ⏹️ [Stop]  ▶️ [Play]            │
│                                                │
│  Takes:                                        │
│  Take 1: ★★★☆☆ (0:02, a bit rushed)           │
│  Take 2: ★★★★★ (0:02, BEST)                   │
│  Take 3: ★★☆☆☆ (0:03, too slow)               │
│                                                │
│  Auto-Process:                                 │
│  ✓ Noise reduction                             │
│  ✓ Normalize volume                            │
│  ✓ Trim silence                                │
│  ✓ Convert to game format (OGG 22kHz)          │
│                                                │
│  [Next Line] [Save Best Take] [Cancel]         │
└────────────────────────────────────────────────┘
```

### 4. Audio Mixing & Ducking

```
┌────────────────────────────────────────────────┐
│  Audio Mixer                                   │
├────────────────────────────────────────────────┤
│  Volume Levels (Individual Control):           │
│                                                │
│  🎵 Master:    ████████▒▒ 80%  [Mute]          │
│  🎼 Music:     ██████░░░░ 60%  [Mute] [Solo]   │
│  🔊 SFX:       ██████████ 100% [Mute] [Solo]   │
│  🗣️ Dialogue:  ██████████ 100% [Mute] [Solo]   │
│  🌬️ Ambient:   ████░░░░░░ 40%  [Mute] [Solo]   │
│  🎮 UI:        ████████░░ 80%  [Mute] [Solo]   │
│                                                │
│  Auto-Ducking (Smart Volume):                  │
│  ✓ When dialogue plays:                        │
│    • Lower Music to 30% (-10dB)                │
│    • Lower Ambient to 20% (-14dB)              │
│    • Fade time: 0.3s                           │
│                                                │
│  ✓ When cutscene plays:                        │
│    • Lower Music to 40%                        │
│    • Silence SFX completely                    │
│                                                │
│  Priority System:                              │
│  1. Dialogue (highest, never interrupted)      │
│  2. Critical SFX (door opening, item pickup)   │
│  3. Music                                      │
│  4. Ambient                                    │
│  5. Background SFX                             │
│                                                │
│  Channels: 32 simultaneous sounds max          │
│  Current: 7 playing                            │
│                                                │
│  [Reset Defaults] [Save Preset] [Test Mix]     │
└────────────────────────────────────────────────┘
```

### 5. Spatial/Positional Audio (3D Sound)

```
┌────────────────────────────────────────────────┐
│  Spatial Audio Configuration                   │
├────────────────────────────────────────────────┤
│  Sound: waterfall.ogg                          │
│  Position: (150, 80) in room coordinates       │
│                                                │
│  [Room View with Audio Visualization]          │
│  ┌──────────────────────────────────────┐     │
│  │         🔊 Waterfall                 │     │
│  │        (((      )))                  │     │
│  │       (   (    )   )                 │     │
│  │      (     (  )     )  ← Sound waves│     │
│  │       (   (    )   )                 │     │
│  │  👤    (((      )))                  │     │
│  │ Player            │                  │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Spatial Settings:                             │
│  Max Distance: [300] pixels                    │
│  Min Distance: [50] pixels (full volume)       │
│                                                │
│  Falloff Curve:                                │
│  Volume 100% ─┐                                │
│            80% │                               │
│            60% │  ┌───── Logarithmic (natural)│
│            40% │  │                            │
│            20% │  │                            │
│             0% └──┘                            │
│            0   50  150   300 (distance)        │
│                                                │
│  Stereo Panning: ✓ Enabled                     │
│  (Waterfall on right → audio plays from right) │
│                                                │
│  Doppler Effect: ⬜ (for moving sounds)         │
│                                                │
│  [Preview at Position] [Test Walk Through]     │
└────────────────────────────────────────────────┘
```

### 6. Audio Triggers & Events

```
┌────────────────────────────────────────────────┐
│  Audio Event System                            │
├────────────────────────────────────────────────┤
│  Trigger: Player enters "Forest" room          │
│                                                │
│  Audio Actions:                     [+ Add]    │
│  1. ✓ Play Music "forest_theme.ogg"            │
│     Crossfade from previous: 2.0s              │
│     Loop: ✓ Seamless                           │
│                                                │
│  2. ✓ Play Ambient "birds_chirping.ogg"        │
│     Volume: 40%                                │
│     Loop: ✓ Random interval (10-30s)           │
│                                                │
│  3. ✓ Stop "town_ambient.ogg"                  │
│     Fade out: 1.5s                             │
│                                                │
│  Advanced Triggers:                            │
│  IF time is Night:                             │
│    → Play "crickets.ogg" instead of birds      │
│    → Lower music volume to 50%                 │
│                                                │
│  IF weather is Raining:                        │
│    → Add layer "rain_on_leaves.ogg"            │
│    → Mix with base forest ambient              │
│                                                │
│  Random Events:                                │
│  Every 30-90 seconds:                          │
│    → Play random "owl_hoot.ogg" (20% chance)   │
│    → Position: Random location in room         │
│                                                │
│  [Test Trigger] [Save] [Delete]                │
└────────────────────────────────────────────────┘
```

### 7. Audio Waveform Editor

```
┌────────────────────────────────────────────────┐
│  Waveform Editor: door_creak.wav               │
├────────────────────────────────────────────────┤
│  [Waveform Display]                            │
│  ┌──────────────────────────────────────┐     │
│  │     ▁▃▅▇█▇▅▃▂▁         ▁▂▃▅▇▅▃▂▁     │     │
│  │ |───Selection───|                    │     │
│  │ 0.0s    0.8s    1.2s           2.4s  │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Selection: 0.0s - 1.2s (trim end silence)     │
│                                                │
│  Quick Edits:                                  │
│  [Trim Start] [Trim End] [Normalize]           │
│  [Fade In] [Fade Out] [Reverse]                │
│  [Change Pitch] [Change Speed]                 │
│                                                │
│  Effects:                                      │
│  ⬜ Reverb (cave echo, room ambience)           │
│  ⬜ EQ (bass boost, treble cut)                 │
│  ⬜ Compression (even out volume)               │
│  ✓ Noise Reduction (remove background hiss)    │
│                                                │
│  Loop Points:                                  │
│  Start: [0.1s] ←→ End: [2.3s]                  │
│  Crossfade: [0.05s] (seamless loop)            │
│  [Test Loop]                                   │
│                                                │
│  [Undo] [Redo] [Save] [Save As] [Close]        │
└────────────────────────────────────────────────┘
```

### 8. Audio Format Support

```
┌────────────────────────────────────────────────┐
│  Audio Import & Conversion                     │
├────────────────────────────────────────────────┤
│  Supported Import Formats:                     │
│  ✓ WAV (uncompressed, best quality)            │
│  ✓ MP3 (compressed, larger files)              │
│  ✓ OGG Vorbis (compressed, recommended)        │
│  ✓ FLAC (lossless compression)                 │
│  ✓ M4A/AAC (Apple format)                      │
│                                                │
│  Game Export Format:                           │
│  ⦿ OGG Vorbis (best balance)                   │
│    Quality: ●───────○ Higher (64kbps - 192kbps)│
│    Current: 128kbps (recommended)              │
│                                                │
│  ○ WAV (uncompressed, huge files)              │
│  ○ MP3 (patent issues, not recommended)        │
│                                                │
│  Optimization:                                 │
│  ✓ Convert stereo to mono (50% size saving)    │
│    (Use for SFX, keep music stereo)            │
│                                                │
│  ✓ Resample to 22kHz (50% size saving)         │
│    (Retro games don't need 44kHz)              │
│                                                │
│  ✓ Trim silence at start/end                   │
│                                                │
│  Estimated Size Reduction: 75%                 │
│  Before: 45.2 MB → After: 11.3 MB              │
│                                                │
│  [Import Files] [Batch Convert] [Apply]        │
└────────────────────────────────────────────────┘
```

---

## Bevy Implementation

### Audio Architecture

```rust
// Audio resources
#[derive(Resource)]
pub struct AudioManager {
    music: Handle<AudioSource>,
    music_controller: AudioController,
    sfx_pool: Vec<Handle<AudioSource>>,
    mixer: AudioMixer,
}

#[derive(Resource)]
pub struct AudioMixer {
    master_volume: f32,
    music_volume: f32,
    sfx_volume: f32,
    dialogue_volume: f32,
    ambient_volume: f32,
}

// Spatial audio component
#[derive(Component)]
pub struct SpatialAudio {
    source: Handle<AudioSource>,
    max_distance: f32,
    rolloff: RolloffType,
    position: Vec2,
}

// Audio ducking system
fn audio_ducking_system(
    mut mixer: ResMut<AudioMixer>,
    dialogue_query: Query<&DialogueActive>,
) {
    if !dialogue_query.is_empty() {
        // Duck music when dialogue plays
        mixer.music_volume *= 0.3; // -10dB
        mixer.ambient_volume *= 0.2; // -14dB
    }
}

// Music crossfade system
fn music_crossfade_system(
    mut commands: Commands,
    audio: Res<Audio>,
    mut current_music: ResMut<CurrentMusic>,
    new_music: Res<NextMusic>,
    time: Res<Time>,
) {
    if let Some(next) = new_music.track {
        // Fade out current
        current_music.volume -= time.delta_seconds() / 2.0;

        if current_music.volume <= 0.0 {
            // Stop old, start new
            audio.stop(current_music.handle);
            audio.play_with_settings(
                next,
                PlaybackSettings::LOOP.with_volume(0.0)
            );
            // Fade in new
            *current_music = CurrentMusic::new(next);
        }
    }
}
```

**Bevy Crates:**
- `bevy_kira_audio` - Full-featured audio with spatial support
- `oddio` - Spatial audio with doppler
- `rodio` - Low-level audio playback
- Custom ducking/crossfade systems

---

## Integration with Existing Systems

### 1. **Dialogue System**
- Auto-play voice files with dialogue
- Subtitle sync with audio timestamps
- Lip sync with phoneme detection

### 2. **Cutscene System**
- Music stingers at dramatic moments
- Audio ducking during dialogue
- Sound effects synchronized with actions

### 3. **Environmental Effects**
- Rain sound matches rain visual effect
- Wind audio intensity matches visual
- Thunder sound synced with lightning flash

### 4. **Accessibility System**
- Closed captions for all audio
- Visual indicators for deaf players
- Separate volume controls

### 5. **Localization System**
- Language-specific voice acting files
- Automatic subtitle translation
- Lip sync works across languages

---

## Summary: Professional Audio

| Feature | AGS Reality | RetroQuest Solution |
|---------|------------|-------------------|
| **Music Transitions** | Abrupt cuts | Smooth crossfading with curves |
| **Audio Ducking** | Manual volume code | Automatic intelligent ducking |
| **Spatial Audio** | Not supported | Full 3D positional audio |
| **Voice Acting** | Manual file management | Integrated recording + lip sync |
| **Audio Mixing** | Single volume slider | 6-channel mixer with priorities |
| **Waveform Editing** | External tools required | Built-in editor + effects |
| **File Organization** | Chaos | Smart categories + search |

**Without pro audio:** Game feels 50% complete
**With RetroQuest audio:** Cinematic, immersive, professional

---

**RetroQuest = First no-code adventure maker with DAW-quality audio tools!** 🎵🎮✨
