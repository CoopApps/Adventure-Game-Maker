# Localization System - Multi-Language Support

## Making RetroQuest Games Globally Accessible

**Why This Is Critical:**
- **Market Expansion**: 75% of players prefer games in their native language
- **Revenue Impact**: Localized games see 128% higher revenue on average
- **Platform Requirements**: Steam, Epic, consoles require multi-language support
- **Legal Compliance**: EU markets often require local language options
- **Competitive Advantage**: Most no-code tools have poor or no localization

**Current Coverage:** 0% ❌
**Priority:** CRITICAL - Blocks international distribution

---

## The Localization Challenge

### AGS Way: ❌ Manual String Replacement Hell

```c
// English version
function hDoor_Interact() {
    player.Say("The door is locked.");
    Display("You need a key.");
}

// Spanish version - separate game file!
function hDoor_Interact() {
    player.Say("La puerta está cerrada.");
    Display("Necesitas una llave.");
}

// Problems:
// - Must maintain separate .asc files per language
// - No central string management
// - Easy to miss strings
// - Can't switch language at runtime
// - Text length changes break UI layouts
// - No font support for non-Latin scripts
```

**Challenges with manual localization:**
1. **String Sprawl**: Text scattered across 100+ script files
2. **No Context**: Translators don't know where text appears
3. **Missing Strings**: Easy to forget dialogue, UI, hints
4. **Length Problems**: German text is 30% longer, breaks layouts
5. **Font Issues**: Russian, Chinese, Arabic need different fonts
6. **No Testing**: Can't preview other languages easily
7. **Update Nightmare**: Changing one line requires updating 10 language files

---

## RetroQuest Solution: ✅ Visual Localization Manager

### 1. Central String Management

```
┌────────────────────────────────────────────────┐
│  Localization Manager                 [+ Add]  │
├────────────────────────────────────────────────┤
│  Project Languages:                            │
│  🇺🇸 English (Primary)    1,247 strings  100%  │
│  🇪🇸 Spanish (ES)          1,247 strings  100%  │
│  🇫🇷 French                1,243 strings   99%  │
│  🇩🇪 German                1,189 strings   95%  │
│  🇯🇵 Japanese                982 strings   78%  │
│  🇨🇳 Chinese (Simplified)   845 strings   67%  │
│  🇷🇺 Russian                721 strings   57%  │
│                                                │
│  Missing Translations: 502 strings             │
│  [Export for Translation] [Import] [Preview]   │
├────────────────────────────────────────────────┤
│  String Table                     🔍 [Search]  │
├────────────────────────────────────────────────┤
│  ID: DOOR_LOCKED_01                            │
│  Category: Dialogue > Environment              │
│  Context: Player tries locked door             │
│  Character Limit: 50 (fits UI bubble)          │
│                                                │
│  🇺🇸 EN: "The door is locked."                 │
│            └─ 21 chars                         │
│                                                │
│  🇪🇸 ES: "La puerta está cerrada."             │
│            └─ 26 chars ⚠️ 23% longer          │
│                                                │
│  🇩🇪 DE: "Die Tür ist verschlossen."           │
│            └─ 27 chars ⚠️ 28% longer          │
│                                                │
│  🇯🇵 JP: "ドアに鍵がかかっている。"               │
│            └─ 13 chars ✓ Fits                 │
│                                                │
│  🇨🇳 CN: "门被锁上了。"                         │
│            └─ 6 chars ✓ Fits                  │
│                                                │
│  🇫🇷 FR: [Missing] ❌                           │
│  🇷🇺 RU: [Missing] ❌                           │
│                                                │
│  [Edit] [Add Translation] [Mark for Review]    │
│  [Preview in Game] [Audio Sync]                │
└────────────────────────────────────────────────┘
```

### 2. Automatic String Extraction

```
┌────────────────────────────────────────────────┐
│  String Extraction Tool                        │
├────────────────────────────────────────────────┤
│  Scan game for translatable text:             │
│                                                │
│  ✓ All dialogue lines (547 strings found)      │
│  ✓ UI labels & buttons (89 strings found)      │
│  ✓ Item names & descriptions (156 found)       │
│  ✓ Character names (23 found)                  │
│  ✓ Room descriptions (42 found)                │
│  ✓ Quest text (78 found)                       │
│  ✓ Tutorial text (64 found)                    │
│  ✓ Achievement text (48 found)                 │
│  ✓ Subtitles/captions (200 found)              │
│                                                │
│  Total: 1,247 translatable strings             │
│                                                │
│  Auto-generate IDs: ✓                          │
│  Group by category: ✓                          │
│  Add context hints: ✓                          │
│                                                │
│  [Extract All] [Review] [Export CSV]           │
└────────────────────────────────────────────────┘
```

### 3. Translation Workflow

```
┌────────────────────────────────────────────────┐
│  Export Translation Package                    │
├────────────────────────────────────────────────┤
│  Format:                                       │
│  ⦿ CSV (Excel/Google Sheets)                   │
│  ○ JSON (for dev tools)                        │
│  ○ XLIFF (professional CAT tools)              │
│  ○ PO/POT (gettext standard)                   │
│                                                │
│  Include:                                      │
│  ✓ String IDs                                  │
│  ✓ Source text (English)                       │
│  ✓ Context/notes                               │
│  ✓ Character limits                            │
│  ✓ Screenshots (where text appears)            │
│  ⬜ Previous translations (for updates)         │
│                                                │
│  Export columns:                               │
│  [ID] [Context] [EN] [ES] [FR] [DE] [JP]       │
│                                                │
│  [Export] [Send to Translator] [Import]        │
└────────────────────────────────────────────────┘
```

**CSV Export Example:**
```csv
ID,Context,Category,CharLimit,EN,ES,FR,DE,JP,CN
DOOR_LOCKED_01,"Player tries door","Dialogue",50,"The door is locked.","La puerta está cerrada.","","Die Tür ist verschlossen.","ドアに鍵がかかっている。","门被锁上了。"
BUTTON_CONTINUE,"Main menu button","UI",20,"Continue","Continuar","Continuer","Weiter","続ける","继续"
ITEM_KEY_NAME,"Inventory item","Items",30,"Rusty Key","Llave Oxidada","Clé Rouillée","Rostiger Schlüssel","錆びた鍵","生锈的钥匙"
```

### 4. Font & Encoding System

```
┌────────────────────────────────────────────────┐
│  Font Configuration                            │
├────────────────────────────────────────────────┤
│  Language-Specific Fonts:                      │
│                                                │
│  🇺🇸 English:   [PixelFont.ttf]      ✓ Loaded  │
│  🇪🇸 Spanish:   [PixelFont.ttf]      (Same)    │
│  🇫🇷 French:    [PixelFont.ttf]      (Same)    │
│  🇩🇪 German:    [PixelFont.ttf]      (Same)    │
│                                                │
│  🇯🇵 Japanese:  [NotoSansJP.otf]    ✓ Loaded  │
│     Glyphs: Hiragana, Katakana, Kanji          │
│     Fallback: MS Gothic                        │
│                                                │
│  🇨🇳 Chinese:   [NotoSansSC.otf]    ✓ Loaded  │
│     Glyphs: Simplified Chinese 3,500 chars     │
│     Fallback: SimHei                           │
│                                                │
│  🇷🇺 Russian:   [PixelCyrillic.ttf] ✓ Loaded  │
│     Glyphs: Cyrillic А-Я а-я                   │
│                                                │
│  🇦🇪 Arabic:    [NotoNaskhArabic.otf] ⚠️       │
│     Direction: Right-to-Left ⬅️                │
│     Ligatures: Enabled ✓                       │
│     Fallback: Arial Arabic                     │
│                                                │
│  Encoding: UTF-8 ✓                             │
│  Emoji support: ✓ (for UI icons)               │
│                                                │
│  [Add Font] [Test Glyphs] [Preview]            │
└────────────────────────────────────────────────┘
```

### 5. Runtime Language Switching

```
┌────────────────────────────────────────────────┐
│  Language Selector (In-Game Settings)          │
├────────────────────────────────────────────────┤
│  🌍 Game Language:                             │
│                                                │
│  ○ 🇺🇸 English                                 │
│  ○ 🇪🇸 Español                                 │
│  ○ 🇫🇷 Français                                │
│  ○ 🇩🇪 Deutsch                                 │
│  ⦿ 🇯🇵 日本語                                  │
│  ○ 🇨🇳 简体中文                                │
│  ○ 🇷🇺 Русский                                │
│                                                │
│  ⚠️ Changing language will reload the game     │
│  Progress will be saved                        │
│                                                │
│  [Apply] [Cancel]                              │
└────────────────────────────────────────────────┘
```

**What happens when language changes:**
1. Save current game state
2. Reload all UI text from new language file
3. Reload dialogue trees
4. Switch font if needed (Latin → CJK)
5. Adjust UI layout for text length
6. Restore game state
7. Total reload time: < 2 seconds

### 6. Text Length & Layout Adaptation

```
┌────────────────────────────────────────────────┐
│  Dynamic UI Layout System                      │
├────────────────────────────────────────────────┤
│  Automatic text fitting:                       │
│                                                │
│  English (short):                              │
│  ┌─────────────┐                               │
│  │   Continue   │  ← Centered, 10 chars        │
│  └─────────────┘                               │
│                                                │
│  German (longer):                              │
│  ┌──────────────────┐                          │
│  │   Fortsetzen      │  ← Expands, 11 chars   │
│  └──────────────────┘                          │
│                                                │
│  Japanese (shorter):                           │
│  ┌──────────┐                                  │
│  │   続ける   │  ← Shrinks, 3 chars           │
│  └──────────┘                                  │
│                                                │
│  Options:                                      │
│  ⦿ Auto-resize buttons to fit text             │
│  ○ Fixed size, scale font down if needed       │
│  ○ Truncate with "..." (not recommended)       │
│                                                │
│  Dialogue Bubbles:                             │
│  ⦿ Expand height for long text                 │
│  ⦿ Auto word-wrap                              │
│  ✓ Min 3 lines, Max 6 lines                    │
│                                                │
│  Text Overflow Handling:                       │
│  ⦿ Scale font down 10% max                     │
│  ✓ Warn if text > character limit              │
│  ✓ Show in red during preview                  │
│                                                │
│  [Configure Layouts] [Test All Languages]      │
└────────────────────────────────────────────────┘
```

### 7. Right-to-Left (RTL) Language Support

```
┌────────────────────────────────────────────────┐
│  RTL Language Configuration (Arabic, Hebrew)   │
├────────────────────────────────────────────────┤
│  Text Direction:                               │
│  ⦿ Right-to-Left (RTL)                         │
│  ○ Left-to-Right (LTR)                         │
│                                                │
│  UI Mirroring:                                 │
│  ✓ Flip entire UI horizontally                 │
│  ✓ Dialogue boxes on right side                │
│  ✓ Menus align right                           │
│  ✓ Scroll bars on left                         │
│                                                │
│  Example (Arabic):                             │
│                                                │
│  LTR (English):                                │
│  ┌─────────────────┐                           │
│  │ [Icon] Text     │  ← Icon left              │
│  └─────────────────┘                           │
│                                                │
│  RTL (Arabic):                                 │
│  ┌─────────────────┐                           │
│  │     النص [Icon] │  ← Icon right (flipped)   │
│  └─────────────────┘                           │
│                                                │
│  Text Shaping:                                 │
│  ✓ Arabic ligatures (ل + ا = لا)               │
│  ✓ Contextual forms (isolated, initial, etc.)  │
│  ✓ Diacritics support (َ ِ ُ)                  │
│                                                │
│  [Preview RTL] [Test Layout] [Save]            │
└────────────────────────────────────────────────┘
```

### 8. Translation Status & Quality Assurance

```
┌────────────────────────────────────────────────┐
│  Translation Quality Dashboard                 │
├────────────────────────────────────────────────┤
│  🇩🇪 German Translation Progress               │
│                                                │
│  Overall: ████████████▒▒▒▒▒▒ 95% (1,189/1,247) │
│                                                │
│  By Category:                                  │
│  ✓ UI Text:          100% (89/89)   ✅         │
│  ✓ Dialogue:          98% (536/547) ⚠️         │
│  ✓ Items:            100% (156/156) ✅         │
│  ⚠️ Quests:           85% (66/78)   ❌         │
│  ⚠️ Achievements:     75% (36/48)   ❌         │
│  ✓ Tutorials:         97% (62/64)   ⚠️         │
│                                                │
│  Issues:                                       │
│  ⚠️ 11 strings exceed character limit          │
│  ⚠️ 3 dialogue lines missing context           │
│  ❌ 58 strings marked "Needs review"           │
│  ⚠️ 2 strings use placeholder text             │
│                                                │
│  Length Analysis:                              │
│  Average expansion: +22% vs English            │
│  Longest string: 187% (breaks UI) ⛔           │
│  Font compatibility: ✓ All glyphs available    │
│                                                │
│  [Review Issues] [Export Missing] [Validate]   │
└────────────────────────────────────────────────┘
```

### 9. In-Context Preview System

```
┌────────────────────────────────────────────────┐
│  Preview Translation In-Game                   │
├────────────────────────────────────────────────┤
│  Select language: [German ▼]                   │
│  Select scene: [Town Square ▼]                 │
│                                                │
│  [Game Preview Window]                         │
│  ┌──────────────────────────────────────┐     │
│  │  🏰 Town Square                      │     │
│  │                                      │     │
│  │  ┌─────────────────────────────┐    │     │
│  │  │ 👨 "Die Tür ist verschlossen."│   │     │
│  │  │    "Ich brauche einen         │   │     │
│  │  │     Schlüssel."               │   │     │
│  │  └─────────────────────────────┘    │     │
│  │                                      │     │
│  │  [Weiter]  [Abbrechen]              │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  Issues detected:                              │
│  ✓ Text fits in bubble                        │
│  ✓ Buttons fit all text                       │
│  ⚠️ Font slightly small (10px → 9px scaled)   │
│                                                │
│  [Next Scene] [Test All Dialogues] [Export]    │
└────────────────────────────────────────────────┘
```

### 10. Localization Testing Tools

```
┌────────────────────────────────────────────────┐
│  Localization Testing Suite                    │
├────────────────────────────────────────────────┤
│  Automated Checks:                             │
│                                                │
│  ✓ Missing Strings:        0 found    ✅       │
│  ✓ Duplicate IDs:          0 found    ✅       │
│  ✓ Invalid Characters:     0 found    ✅       │
│  ⚠️ Character Limit:        11 exceed  ⚠️       │
│  ⚠️ Placeholder Text:       2 found    ⚠️       │
│  ✓ Font Coverage:          100%       ✅       │
│  ⚠️ UI Overflow:            3 cases    ⚠️       │
│                                                │
│  Pseudo-Localization Test:                     │
│  Generate test language to catch issues        │
│                                                │
│  Original:  "The door is locked."              │
│  Pseudo-DE: "[Ţĥé ðööŕ ïš ļöçķéð··]"           │
│  (30% longer, accents, brackets)               │
│                                                │
│  ⦿ Enable pseudo-translation                   │
│  ○ Disable                                     │
│                                                │
│  Test all languages in sequence:               │
│  [🇺🇸 EN] → [🇪🇸 ES] → [🇩🇪 DE] → [🇯🇵 JP]     │
│                                                │
│  [Run All Tests] [Generate Report] [Fix]       │
└────────────────────────────────────────────────┘
```

---

## Bevy Implementation Notes

### Localization Architecture

**Bevy Resources:**
```rust
// Central translation database
#[derive(Resource)]
pub struct LocalizationManager {
    current_language: Language,
    strings: HashMap<String, HashMap<Language, String>>,
    fonts: HashMap<Language, Handle<Font>>,
}

// Language enum
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum Language {
    English,
    Spanish,
    French,
    German,
    Japanese,
    ChineseSimplified,
    Russian,
    Arabic,
}

// Localizable text component
#[derive(Component)]
pub struct LocalizedText {
    string_id: String,
    fallback: String,
}
```

**Systems:**
```rust
// Update all text when language changes
fn update_localized_text_system(
    loc: Res<LocalizationManager>,
    mut query: Query<(&LocalizedText, &mut Text), Changed<LocalizationManager>>
) {
    for (localized, mut text) in query.iter_mut() {
        text.sections[0].value = loc.get_string(&localized.string_id);
    }
}

// Hot-reload translations in editor
fn hot_reload_translations(
    mut loc: ResMut<LocalizationManager>,
    asset_server: Res<AssetServer>,
) {
    // Watch translation files for changes
    // Reload on modification
}
```

**File Format (JSON):**
```json
{
  "metadata": {
    "language": "es",
    "version": "1.0",
    "completeness": 0.98
  },
  "strings": {
    "DOOR_LOCKED_01": "La puerta está cerrada.",
    "BUTTON_CONTINUE": "Continuar",
    "ITEM_KEY_NAME": "Llave Oxidada"
  }
}
```

**Font Loading:**
```rust
// Load language-specific fonts
fn load_language_fonts(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
) {
    let fonts = HashMap::from([
        (Language::English, asset_server.load("fonts/pixel.ttf")),
        (Language::Japanese, asset_server.load("fonts/noto_jp.otf")),
        (Language::ChineseSimplified, asset_server.load("fonts/noto_sc.otf")),
        (Language::Russian, asset_server.load("fonts/cyrillic.ttf")),
    ]);

    commands.insert_resource(LocalizationManager::new(fonts));
}
```

---

## Integration with Existing Systems

### 1. **Dialogue System Integration**
- Dialogue node text uses string IDs, not hardcoded text
- Auto-generate IDs: `DIALOGUE_{CHAR}_{SCENE}_{LINE_NUM}`
- Preview dialogue trees in any language

### 2. **Quest System Integration**
- Quest names, descriptions, objectives all localized
- Quest completion text in all languages
- Hint system translates hints

### 3. **UI System Integration**
- All buttons, labels, menus use string IDs
- Auto-resize UI elements based on text length
- Font switching per language

### 4. **Tutorial System Integration**
- Tutorial text fully translated
- Tooltip strings localized
- Screenshot captures show localized UI

### 5. **Achievement System Integration**
- Achievement titles and descriptions localized
- Unlock notifications in player's language
- Steam/platform integration uses correct language strings

---

## Workflow Example: Adding a New Language

```
1. Add Language
   ├─ Select "Add Language" in Localization Manager
   ├─ Choose: Portuguese (BR) 🇧🇷
   └─ System creates empty translation file

2. Extract Strings
   ├─ Click "Extract All Strings"
   ├─ System scans: 1,247 strings found
   └─ Generates pt_BR.json template

3. Export for Translation
   ├─ Choose format: CSV
   ├─ Export to: translations_pt_BR.csv
   └─ Send to translator via email/Crowdin

4. Translator Works
   ├─ Opens CSV in Excel/Google Sheets
   ├─ Fills "pt_BR" column
   └─ Returns completed file

5. Import Translation
   ├─ Click "Import Translation"
   ├─ Select: translations_pt_BR.csv
   └─ System validates: 1,245/1,247 strings (99%)

6. Review & Test
   ├─ Check missing 2 strings
   ├─ Preview in-game with Portuguese
   ├─ Test UI layout (text fits?)
   └─ Fix any overflow issues

7. Add Font (if needed)
   ├─ Portuguese uses Latin chars (same font)
   └─ No font change needed ✓

8. Publish
   ├─ Mark Portuguese as "Available"
   ├─ Language appears in settings menu
   └─ Steam/Itch.io: add Portuguese tag
```

Total time: 2 hours (setup) + translator time + 1 hour (QA)

---

## Summary: Why This Matters

| Challenge | AGS Reality | RetroQuest Solution |
|-----------|------------|-------------------|
| **String Management** | Scattered across 100+ files | Central string database with IDs |
| **Translation Workflow** | Manual file editing | Export CSV → translate → import |
| **Font Support** | Manual font hacking | Auto-load language-specific fonts |
| **RTL Languages** | Not supported | Full RTL support with UI mirroring |
| **Testing** | Play entire game per language | In-context preview + auto-validation |
| **Updates** | Find and update 10 files | Update one string ID, propagates everywhere |
| **Market Access** | English-only = 30% of market | 7+ languages = global distribution |

**Without localization:** RetroQuest games reach ~400M English speakers
**With localization:** RetroQuest games reach ~5.5B potential players (13.7x larger market)

---

## Technical Specifications

**Supported Languages (Launch):**
- ✅ English (US/UK)
- ✅ Spanish (ES/LATAM)
- ✅ French
- ✅ German
- ✅ Portuguese (BR)
- ✅ Italian
- ✅ Russian
- ✅ Japanese
- ✅ Chinese (Simplified/Traditional)
- ✅ Korean
- ✅ Arabic (RTL)
- ✅ Hebrew (RTL)

**File Formats:**
- Import/Export: CSV, JSON, XLIFF, PO/POT
- Encoding: UTF-8 with BOM
- Max string length: 10,000 characters
- String ID format: CATEGORY_CONTEXT_ID

**Performance:**
- Language switching: < 2 seconds
- Memory overhead: ~2MB per language
- Hot-reload in editor: < 100ms

**Bevy Crates:**
- `bevy_fluent` - Fluent localization system
- `unic-langid` - Language identifier
- `sys-locale` - Detect system language
- Custom string table manager

---

**RetroQuest = First no-code adventure maker with professional-grade localization!** 🌍✨
