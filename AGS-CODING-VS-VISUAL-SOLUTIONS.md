# AGS Coding Requirements → RetroQuest Visual Solutions

## Complete Analysis: Every Script in AGS Gets a Visual Alternative

Based on research from [AGS Scripting Tutorial](https://adventuregamestudio.github.io/ags-manual/ScriptingTutorialPart1.html), [Character Functions](https://adventuregamestudio.github.io/ags-manual/Character.html), [Dialog Script](https://adventuregamestudio.github.io/ags-manual/DialogScript.html), and [Global Functions](https://adventuregamestudio.github.io/ags-manual/Globalfunctions_General.html).

---

## 1. Hotspot Interactions

### AGS Requires Code:

```c
function hDoor_Interact() {
    if (player.HasInventory(iKey)) {
        player.Say("The key fits!");
        player.LoseInventory(iKey);
        hDoor.Enabled = false;
        player.ChangeRoom(2, 100, 100);
    } else {
        player.Say("It's locked.");
    }
}
```

**Skills needed:** Variables, conditionals, function syntax, object methods

### RetroQuest Visual Solution:

```
┌────────────────────────────────────────────┐
│  Hotspot: "Locked Door"                    │
│  On: Interact                              │
├────────────────────────────────────────────┤
│  [Condition Block]                         │
│  IF ┌────────────────────────────────┐    │
│     │ Player HAS item "Rusty Key"    │    │
│     └────────────────────────────────┘    │
│  THEN:                                     │
│    1. ▶ Say "The key fits!"               │
│    2. ⊖ Remove item "Rusty Key"           │
│    3. ✗ Disable hotspot "Locked Door"     │
│    4. 🚪 Go to room "Hallway" at (100,100)│
│                                            │
│  ELSE:                                     │
│    1. ▶ Say "It's locked."                │
│                                            │
│  [+ Add Condition] [+ Add Action]         │
└────────────────────────────────────────────┘
```

**Implementation:**
- Dropdown: "Player HAS item" → Select from inventory list
- Drag action blocks: Say, Remove item, Disable, Go to room
- No typing except dialogue text
- Visual preview shows logic flow

---

## 2. Variables & Flags

### AGS Requires Code:

```c
// Global script
int talkedToGuard = 0;
int playerHealth = 100;

function hGuard_Talk() {
    if (talkedToGuard == 0) {
        cGuard.Say("First time talking!");
        talkedToGuard = 1;
    } else {
        cGuard.Say("We've met before.");
    }
}

function repeatedly_execute() {
    if (playerHealth <= 0) {
        player.Die();
    }
}
```

**Skills needed:** Variable declaration, data types, comparison operators, loops

### RetroQuest Visual Solution:

**Global Flags Panel:**
```
┌────────────────────────────────────────────┐
│  Game Variables                   [+ Add]  │
├────────────────────────────────────────────┤
│  🏁 talkedToGuard                          │
│     Type: Flag (true/false)                │
│     Initial: false                         │
│     Description: Met guard                 │
├────────────────────────────────────────────┤
│  ❤️ playerHealth                           │
│     Type: Number                           │
│     Initial: 100                           │
│     Range: 0-100                           │
│     Description: Player HP                 │
└────────────────────────────────────────────┘
```

**In Interaction Builder:**
```
┌────────────────────────────────────────────┐
│  Guard: On Talk                            │
├────────────────────────────────────────────┤
│  IF flag "talkedToGuard" is FALSE         │
│    1. Guard says "First time talking!"     │
│    2. Set flag "talkedToGuard" to TRUE    │
│  ELSE                                      │
│    1. Guard says "We've met before."       │
└────────────────────────────────────────────┘
```

**Game Loop Conditions:**
```
┌────────────────────────────────────────────┐
│  Always Running Conditions       [+ Add]   │
├────────────────────────────────────────────┤
│  WHEN "playerHealth" ≤ 0                   │
│    → Trigger "Player Death" sequence       │
└────────────────────────────────────────────┘
```

**No code! All visual!**

---

## 3. Cutscenes & Character Movement

### AGS Requires Code:

```c
function room_AfterFadeIn() {
    cRoger.Walk(100, 80, eBlock);
    cRoger.Say("I made it!");
    Wait(40);
    cVillain.Walk(150, 80, eBlock);
    cVillain.FaceCharacter(cRoger);
    cVillain.Say("Not so fast!");
    cRoger.Animate(5, 5, eOnce, eBlock);
    Wait(20);
    player.ChangeRoom(3);
}
```

**Skills needed:** Function syntax, parameters, blocking/non-blocking, animation loops, timing

### RetroQuest Visual Solution:

**Sequence Timeline Editor:**
```
Time: 0s ────────5s────────10s───────15s
      │           │          │         │
Roger │─Walk─────►│─Say────►│─Animate►│
      (100,80) 2s  "Made it" ─surprised│
                                       │
Villain          │──────Walk──────────►│─Say──►
                 3s    (150,80)   "Not fast"
                                       │
Camera                                 │─FadeOut─►Room3
                                       1s
```

**Visual Interface:**
```
┌────────────────────────────────────────────┐
│  Sequence: "Villain Appears"               │
├────────────────────────────────────────────┤
│  [Timeline View] [List View] [Preview]     │
├────────────────────────────────────────────┤
│  0:00  ┌─────────────────────────────┐    │
│        │ Roger: Walk to (100, 80)    │    │
│        │ Speed: Normal | Block: Yes  │    │
│        └─────────────────────────────┘    │
│  2:00  ┌─────────────────────────────┐    │
│        │ Roger: Say                  │    │
│        │ "I made it!"                │    │
│        └─────────────────────────────┘    │
│  3:50  ┌─────────────────────────────┐    │
│        │ Wait: 1 second              │    │
│        └─────────────────────────────┘    │
│  4:50  ┌─────────────────────────────┐    │
│        │ Villain: Walk to (150, 80)  │    │
│        │ Speed: Normal | Block: Yes  │    │
│        └─────────────────────────────┘    │
│  7:50  ┌─────────────────────────────┐    │
│        │ Villain: Face Roger         │    │
│        └─────────────────────────────┘    │
│  8:00  ┌─────────────────────────────┐    │
│        │ Villain: Say                │    │
│        │ "Not so fast!"              │    │
│        └─────────────────────────────┘    │
│  10:00 ┌─────────────────────────────┐    │
│        │ Roger: Play Animation       │    │
│        │ "Surprised" (loop 5)        │    │
│        └─────────────────────────────┘    │
│  12:00 ┌─────────────────────────────┐    │
│        │ Wait: 0.5 seconds           │    │
│        └─────────────────────────────┘    │
│  12:50 ┌─────────────────────────────┐    │
│        │ Camera: Fade Out            │    │
│        │ Go to Room 3                │    │
│        └─────────────────────────────┘    │
│                                            │
│  [+ Add Event] [Play Preview] [Export]    │
└────────────────────────────────────────────┘
```

**Features:**
- Drag events on timeline
- Auto-calculate durations
- Visual preview with play button
- Parallel events (multiple characters)
- No code needed!

---

## 4. Inventory Item Combinations

### AGS Requires Code:

```c
function iRope_Interact() {
    if (player.ActiveInventory == iHook) {
        player.Say("I'll combine these!");
        player.LoseInventory(iRope);
        player.LoseInventory(iHook);
        player.AddInventory(iGrapplingHook);
        Display("You made a grappling hook!");
    } else {
        player.Say("Just a rope.");
    }
}
```

**Skills needed:** Object references, inventory API, conditionals

### RetroQuest Visual Solution:

**Inventory Combination Builder:**
```
┌────────────────────────────────────────────┐
│  Inventory Combinations          [+ Add]   │
├────────────────────────────────────────────┤
│  🪢 Rope + 🪝 Hook = 🔗 Grappling Hook    │
│  ├─ Remove: Rope, Hook                     │
│  ├─ Add: Grappling Hook                    │
│  ├─ Message: "You made a grappling hook!" │
│  └─ [Edit] [Delete]                        │
├────────────────────────────────────────────┤
│  🔑 Key + 🚪 Lock = ✅ Unlocked Door       │
│  └─ ...                                    │
├────────────────────────────────────────────┤
│  📝 Map + 🧭 Compass = 🗺️ Navigation      │
│  └─ ...                                    │
└────────────────────────────────────────────┘
```

**Add Combination Dialog:**
```
┌────────────────────────────────────────────┐
│  New Combination                           │
├────────────────────────────────────────────┤
│  Item 1: [Rope        ▼]                   │
│  Item 2: [Hook        ▼]                   │
│  Result: [Grappling Hook ▼] [or Create New]│
├────────────────────────────────────────────┤
│  Actions:                                  │
│  ✓ Remove both items                       │
│  ✓ Add result to inventory                 │
│  ✓ Show message                            │
│     Message: [You made a grappling hook!]  │
│  ⬜ Play sound                              │
│  ⬜ Trigger event                           │
├────────────────────────────────────────────┤
│  [Cancel] [Create Combination]             │
└────────────────────────────────────────────┘
```

**No scripting! Pure visual recipe system!**

---

## 5. Dialogue Trees

### AGS Requires Code:

```c
// Dialog script
@1
Player: Hello there!
Guard: Welcome, traveler.
goto-dialog dGuardConversation

// In dialog script with options
@S1
Guard: What do you need?
return

@1
Player: Tell me about the castle.
run-script 1

@2
Player: Goodbye.
stop

// Global script
function dialog_request(int param) {
    if (param == 1) {
        cGuard.Say("The castle has been here for 500 years.");
        if (!PlayerKnowsHistory) {
            PlayerKnowsHistory = true;
            player.AddInventory(iHistoryBook);
        }
    }
}
```

**Skills needed:** Dialog script syntax, goto statements, function calls, parameters

### RetroQuest Visual Solution:

**Node-Based Dialogue Editor:**
```
        ┌──────────────┐
        │ START        │
        │ Guard sees   │
        │ player       │
        └───────┬──────┘
                │
        ┌───────▼──────────┐
        │ Guard:           │
        │ "Welcome,        │
        │  traveler."      │
        └───────┬──────────┘
                │
        ┌───────▼──────────┐
        │ Player:          │
        │ "Hello there!"   │
        └───────┬──────────┘
                │
        ┌───────▼──────────┐
        │ CHOICE           │
        ├──────────────────┤
        │ 1. About castle  │
        │ 2. Goodbye       │
        └───┬──────────┬───┘
            │          │
     ┌──────▼──┐    ┌─▼──────┐
     │ Guard:  │    │ Guard: │
     │ "The    │    │ "Safe  │
     │ castle..│    │ travels│
     └────┬────┘    └────────┘
          │              │
      ┌───▼────┐    ┌───▼────┐
      │[Cond]  │    │ END    │
      │ First  │    └────────┘
      │ time?  │
      └─┬───┬──┘
        │   │
    ┌───▼┐ ┌▼────┐
    │Give│ │Skip │
    │book│ │     │
    └────┘ └─────┘
```

**Visual Editor:**
```
┌────────────────────────────────────────────┐
│  Dialogue: "Guard Conversation"            │
│  [Node Graph] [Preview] [Test]             │
├────────────────────────────────────────────┤
│  Canvas (drag nodes, connect arrows):      │
│                                            │
│   Nodes:                                   │
│   • Speech (character says something)      │
│   • Choice (player chooses response)       │
│   • Condition (check flag/item)            │
│   • Action (give item, set flag)           │
│   • Jump (go to another dialogue)          │
│   • End (finish conversation)              │
│                                            │
│  Right-click: Add node                     │
│  Drag: Create connection                   │
│  Double-click: Edit content                │
│                                            │
│  [Auto-layout] [Validate] [Export]         │
└────────────────────────────────────────────┘
```

**Node Editor (double-click on node):**
```
┌────────────────────────────────────────────┐
│  Speech Node                               │
├────────────────────────────────────────────┤
│  Character: [Guard ▼]                      │
│  Text: [The castle has been here          │
│         for 500 years.              ]      │
│  Animation: [Talk ▼]                       │
│  Voice: [guard_castle.wav] [Browse]        │
│                                            │
│  [OK] [Cancel]                             │
└────────────────────────────────────────────┘
```

**No dialog scripting! Pure visual conversation trees!**

---

## 6. Timers & Delayed Events

### AGS Requires Code:

```c
int timer = 0;

function repeatedly_execute() {
    timer++;
    if (timer == 80) {  // 2 seconds at 40fps
        Display("Time's up!");
        timer = 0;
    }
}

function StartCountdown() {
    timer = 0;
    SetTimer(1, 200);  // 5 seconds
}

function on_event(EventType event, int data) {
    if (event == eEventGotScore) {
        player.AddInventory(iBonus);
    }
}
```

**Skills needed:** Loops, frame calculation, event handling, callbacks

### RetroQuest Visual Solution:

**Timer System:**
```
┌────────────────────────────────────────────┐
│  Timers & Scheduled Events      [+ Add]    │
├────────────────────────────────────────────┤
│  ⏱️ Countdown Timer                         │
│  Duration: [5] seconds                     │
│  When expired:                             │
│    → Show message "Time's up!"             │
│    → Trigger event "Timer Expired"         │
│  [Edit] [Delete]                           │
├────────────────────────────────────────────┤
│  ⏰ Delayed Event                           │
│  Trigger: After [3] seconds                │
│  Action:                                   │
│    → Guard walks to (100, 50)              │
│  [Edit] [Delete]                           │
└────────────────────────────────────────────┘
```

**Add Timer Dialog:**
```
┌────────────────────────────────────────────┐
│  Create Timer                              │
├────────────────────────────────────────────┤
│  Name: [Countdown]                         │
│  Type: ⦿ One-time   ○ Repeating           │
│  Duration: [5] seconds                     │
│                                            │
│  When finished:                            │
│  [+ Add Action]                            │
│    1. Display message "Time's up!"         │
│    2. Play sound "alarm.wav"               │
│    3. Change room to "Game Over"           │
│                                            │
│  Start: ⦿ Automatically   ○ Manually       │
│         ○ When flag set                    │
│                                            │
│  [Create] [Cancel]                         │
└────────────────────────────────────────────┘
```

**Event Triggers Panel:**
```
┌────────────────────────────────────────────┐
│  Event Triggers                  [+ Add]   │
├────────────────────────────────────────────┤
│  WHEN: Player gets score                   │
│  DO:   Give item "Bonus Coin"              │
├────────────────────────────────────────────┤
│  WHEN: Player enters room "Treasure"       │
│  DO:   Start timer "Trap Countdown"        │
├────────────────────────────────────────────┤
│  WHEN: Flag "AlarmTriggered" becomes TRUE  │
│  DO:   Play sequence "Guards Attack"       │
└────────────────────────────────────────────┘
```

**No loop coding! All visual timers and events!**

---

## 7. Character Pathfinding & Movement

### AGS Requires Code:

```c
function room_Load() {
    cRoger.SetWalkSpeed(5, 10);
}

function hDoor_Interact() {
    cRoger.Walk(80, 100, eBlock, eWalkableAreas);
    cRoger.FaceLocation(100, 100);
    cRoger.Animate(ANIM_DOOROPEN, 4, eOnce, eBlock);
    Wait(20);
    cRoger.ChangeRoom(2, 160, 120);
}

// Walk to character
function hGuard_Talk() {
    cRoger.WalkStraight(cGuard.x, cGuard.y - 10, eBlock);
    StartDialog(dGuardDialog);
}
```

**Skills needed:** Character API, coordinate math, animation parameters, blocking

### RetroQuest Visual Solution:

**Character Properties Panel:**
```
┌────────────────────────────────────────────┐
│  Character: Roger                          │
├────────────────────────────────────────────┤
│  Movement:                                 │
│  Walk Speed:  ●────────○ 50%               │
│  Run Speed:   ●──────────○ 80%             │
│                                            │
│  Starting Position (per room):             │
│  Room "Tavern": (50, 100)  [Set on canvas]│
│  Room "Street": (160, 120) [Set on canvas]│
│                                            │
│  Animation:                                │
│  Idle:  [idle_anim ▼]  FPS: [8]            │
│  Walk:  [walk_anim ▼]  FPS: [12]           │
│  Talk:  [talk_anim ▼]  FPS: [6]            │
└────────────────────────────────────────────┘
```

**Interaction Movement Builder:**
```
┌────────────────────────────────────────────┐
│  Door: On Interact                         │
├────────────────────────────────────────────┤
│  1. ⏱️ Roger walks to (80, 100)            │
│     Path: Respect walk areas               │
│     Wait: Yes (block)                      │
│     [Pick on canvas]                       │
│                                            │
│  2. 👁️ Roger faces direction (100, 100)    │
│     [Pick on canvas]                       │
│                                            │
│  3. 🎭 Roger plays animation "Door Open"   │
│     Loop: Once                             │
│     Speed: Normal                          │
│     Wait: Yes                              │
│                                            │
│  4. ⏱️ Wait 0.5 seconds                    │
│                                            │
│  5. 🚪 Roger goes to room "Hallway"        │
│     Position: (160, 120)                   │
│     [Pick on canvas]                       │
└────────────────────────────────────────────┘
```

**Walk-to-Character Helper:**
```
┌────────────────────────────────────────────┐
│  Guard: On Talk                            │
├────────────────────────────────────────────┤
│  1. Walk to character                      │
│     Character: [Guard ▼]                   │
│     Distance: [10] pixels                  │
│     Position: ⦿ In front   ○ Behind        │
│               ○ Left side  ○ Right side    │
│     Path: ⦿ Walk areas   ○ Straight line   │
│     Wait: Yes                              │
│                                            │
│  2. Start dialogue "Guard Conversation"    │
└────────────────────────────────────────────┘
```

**Canvas Visual Helpers:**
- Click to set walk destination
- Drag arrow to set facing direction
- Visual path preview
- No coordinate typing!

---

## 8. Object States & Animations

### AGS Requires Code:

```c
function oChest_Interact() {
    if (oChest.View == 0) {  // Closed
        oChest.Animate(0, 5, eOnce, eNoBlock);
        Wait(20);
        player.AddInventory(iTreasure);
        Display("You found treasure!");
    } else {
        player.Say("It's already open.");
    }
}

function oSwitch_Interact() {
    oSwitch.SetView(SWITCH_VIEW);
    if (oSwitch.Frame == 0) {
        oSwitch.Animate(0, 3, eOnce, eBlock);
        doorOpen = true;
        oDoor.Visible = false;
    } else {
        oSwitch.Frame = 0;
        doorOpen = false;
        oDoor.Visible = true;
    }
}
```

**Skills needed:** Object properties, view/frame system, state management

### RetroQuest Visual Solution:

**Object States System:**
```
┌────────────────────────────────────────────┐
│  Object: Treasure Chest                    │
├────────────────────────────────────────────┤
│  States:                       [+ Add]     │
│                                            │
│  State 1: "Closed" (Default)               │
│    Sprite: [chest_closed.png]              │
│    On Interact:                            │
│      → Change to state "Open"              │
│      → Give item "Treasure"                │
│      → Message "You found treasure!"       │
│                                            │
│  State 2: "Open"                           │
│    Sprite: [chest_open.png]                │
│    Transition: Animate from "Closed"       │
│      Animation: [opening.png] 5 frames     │
│      Speed: Normal                         │
│    On Interact:                            │
│      → Say "It's already open."            │
└────────────────────────────────────────────┘
```

**State Machine Editor:**
```
┌────────────────────────────────────────────┐
│  Object: Lever Switch                      │
├────────────────────────────────────────────┤
│  State Diagram:                            │
│                                            │
│     ┌──────────┐    Pull    ┌──────────┐  │
│     │   OFF    │◄───────────►│   ON     │  │
│     │  (down)  │    Pull     │  (up)    │  │
│     └────┬─────┘             └────┬─────┘  │
│          │                        │        │
│      On Enter:                On Enter:    │
│      • Close door             • Open door  │
│      • Set flag OFF           • Set flag ON│
│                                            │
│  [Edit States] [Preview] [Test]            │
└────────────────────────────────────────────┘
```

**No state code! Visual state machine!**

---

## 9. Random Events & Probability

### AGS Requires Code:

```c
function room_AfterFadeIn() {
    int random = Random(2);  // 0, 1, or 2
    if (random == 0) {
        cGuard.Say("Nice weather today.");
    } else if (random == 1) {
        cGuard.Say("Have you seen the king?");
    } else {
        cGuard.Say("Move along.");
    }
}

function repeatedly_execute() {
    if (Random(100) == 0) {  // 1% chance each frame
        PlaySound(sBirdChirp);
    }
}
```

**Skills needed:** Random functions, probability math, conditionals

### RetroQuest Visual Solution:

**Random Response System:**
```
┌────────────────────────────────────────────┐
│  Guard: Idle Dialogue                      │
├────────────────────────────────────────────┤
│  Type: ⦿ Random   ○ Sequential   ○ Once   │
│                                            │
│  Options:                                  │
│  1. "Nice weather today."      Weight: ▮▮▮│
│  2. "Have you seen the king?"  Weight: ▮▮▮│
│  3. "Move along."              Weight: ▮▮▮│
│                                            │
│  Distribution: Equal (33% each)            │
│                                            │
│  [+ Add Option] [Edit Weights]             │
└────────────────────────────────────────────┘
```

**Random Events Panel:**
```
┌────────────────────────────────────────────┐
│  Ambient Events                 [+ Add]    │
├────────────────────────────────────────────┤
│  🐦 Bird Chirping                          │
│  Chance: [1]% per second                   │
│  Action: Play sound "bird.wav"             │
│  Location: Outdoor rooms only              │
│  [Edit] [Delete]                           │
├────────────────────────────────────────────┤
│  ⚡ Lightning Flash                         │
│  Chance: [5]% per 10 seconds               │
│  Action:                                   │
│    1. Screen flash white                   │
│    2. Wait 0.1s                            │
│    3. Play sound "thunder.wav"             │
│  [Edit] [Delete]                           │
└────────────────────────────────────────────┘
```

**Visual Probability Editor:**
```
┌────────────────────────────────────────────┐
│  Random Event: Merchant Appears            │
├────────────────────────────────────────────┤
│  Trigger: When player enters "Town Square" │
│  Chance: [30]% ●────────○                  │
│           (slider: 0-100%)                 │
│                                            │
│  IF happens:                               │
│    → Spawn character "Merchant"            │
│    → Start dialogue "Merchant Greeting"    │
│                                            │
│  IF doesn't happen:                        │
│    → Nothing (room loads normally)         │
│                                            │
│  [OK] [Cancel]                             │
└────────────────────────────────────────────┘
```

**No probability code! Visual chance system!**

---

## 10. Camera Control & Screen Effects

### AGS Requires Code:

```c
function cutscene_intro() {
    SetViewport(0, 0);
    FadeOut(2);
    player.ChangeRoom(1);
    FadeIn(2);

    // Pan camera
    SetViewport(50, 0);
    Wait(40);
    SetViewport(100, 0);
    Wait(40);
    SetViewport(0, 0);

    ShakeScreen(5);
    Wait(40);

    SetScreenTransition(eTransitionDissolve);
    player.ChangeRoom(2);
}
```

**Skills needed:** Viewport API, timing, screen effects, transitions

### RetroQuest Visual Solution:

**Camera Control Panel:**
```
┌────────────────────────────────────────────┐
│  Sequence: Intro Cutscene                  │
├────────────────────────────────────────────┤
│  0:00  📹 Camera: Fade out (2s)             │
│  2:00  🚪 Change to room "Castle"           │
│  2:00  📹 Camera: Fade in (2s)              │
│  4:00  📹 Camera: Pan to (50, 0)            │
│         Duration: 1s                        │
│  5:00  ⏱️ Wait 1 second                     │
│  6:00  📹 Camera: Pan to (100, 0)           │
│         Duration: 1s                        │
│  7:00  ⏱️ Wait 1 second                     │
│  8:00  📹 Camera: Center on player          │
│         Duration: 1s                        │
│  9:00  📹 Screen: Shake (intensity: 50%)    │
│         Duration: 1s                        │
│  10:00 📹 Transition: Dissolve              │
│  10:00 🚪 Change to room "Throne"           │
└────────────────────────────────────────────┘
```

**Camera Event Editor:**
```
┌────────────────────────────────────────────┐
│  Add Camera Event                          │
├────────────────────────────────────────────┤
│  Type: [Camera Movement ▼]                 │
│                                            │
│  Movement Options:                         │
│  ⦿ Pan to position                         │
│    X: [100] Y: [0]  [Pick on canvas]       │
│    Duration: [1] seconds                   │
│    Easing: [Smooth ▼]                      │
│                                            │
│  ○ Follow character                        │
│    Character: [Player ▼]                   │
│    Offset: X:[0] Y:[0]                     │
│                                            │
│  ○ Zoom                                    │
│    Level: [200]% ●────○ (100-400%)         │
│    Duration: [1] seconds                   │
│                                            │
│  [Add] [Cancel]                            │
└────────────────────────────────────────────┘
```

**Screen Effects Library:**
```
┌────────────────────────────────────────────┐
│  Screen Effects                            │
├────────────────────────────────────────────┤
│  🌊 Fade In/Out                            │
│  🔀 Dissolve                                │
│  📺 Pixelate                                │
│  🌪️ Shake                                   │
│  ⚡ Flash                                    │
│  🌈 Color Tint                              │
│  📸 Freeze Frame                            │
│  🎬 Letterbox                               │
│                                            │
│  Drag to timeline to apply                 │
└────────────────────────────────────────────┘
```

**No viewport code! Visual camera system!**

---

## 11. Save/Load Custom Data

### AGS Requires Code:

```c
// Global script
managed struct SaveData {
    int questProgress;
    int currentChapter;
    String playerName;
};

SaveData* gameData;

function game_start() {
    gameData = new SaveData;
    gameData.questProgress = 0;
    gameData.currentChapter = 1;
    gameData.playerName = "Hero";
}

function SaveGame(int slot) {
    DynamicSprite *sprite = DynamicSprite.CreateFromSaveGame(
        slot, 160, 100
    );
    SaveGameSlot(slot, "Chapter %d", gameData.currentChapter);
    sprite.Delete();
}
```

**Skills needed:** Structs, pointers, string formatting, save API

### RetroQuest Visual Solution:

**Game Data Manager:**
```
┌────────────────────────────────────────────┐
│  Saved Game Data                [+ Add]    │
├────────────────────────────────────────────┤
│  📊 Quest Progress (Number)                │
│     Default: 0                             │
│     Saved: Yes                             │
│                                            │
│  📖 Current Chapter (Number)               │
│     Default: 1                             │
│     Saved: Yes                             │
│                                            │
│  👤 Player Name (Text)                     │
│     Default: "Hero"                        │
│     Saved: Yes                             │
│                                            │
│  🏁 Flags (500 total)                      │
│     talkedToGuard: false                   │
│     foundKey: false                        │
│     ... (all auto-saved)                   │
│                                            │
│  💰 Inventory                              │
│     Auto-saved                             │
└────────────────────────────────────────────┘
```

**Save System (automatic):**
```
┌────────────────────────────────────────────┐
│  Save System Configuration                 │
├────────────────────────────────────────────┤
│  What gets saved:                          │
│  ✓ All game variables                      │
│  ✓ All flags                               │
│  ✓ Inventory items                         │
│  ✓ Current room                            │
│  ✓ Character positions                     │
│  ✓ Object states                           │
│  ✓ Dialogue history                        │
│  ✓ Timestamp                               │
│                                            │
│  Save slots: [10] (max 999)                │
│  Auto-save: ✓ On room change               │
│  Quick-save: ✓ Enable (F5/F9)              │
│                                            │
│  Screenshot: ✓ Include in save file        │
│  Size: [160x100] pixels                    │
└────────────────────────────────────────────┘
```

**No save code! Automatic save system!**

---

## 12. GUI & Custom Menus

### AGS Requires Code:

```c
function btnNewGame_OnClick(GUIControl *control, MouseButton button) {
    gMainMenu.Visible = false;
    player.ChangeRoom(1);
}

function repeatedly_execute() {
    if (IsKeyPressed(eKeyEscape)) {
        gMainMenu.Visible = !gMainMenu.Visible;
    }
}

// Update inventory GUI
function repeatedly_execute_always() {
    if (gInventory.Visible) {
        lblGold.Text = String.Format("Gold: %d", playerGold);
        lblHealth.Text = String.Format("HP: %d/%d",
            playerHealth, maxHealth);
    }
}
```

**Skills needed:** GUI API, event handlers, string formatting, updates

### RetroQuest Visual Solution:

**GUI Designer:**
```
┌────────────────────────────────────────────┐
│  Menu: Main Menu                           │
├────────────────────────────────────────────┤
│  Visual Editor:                            │
│                                            │
│  ┌────────────────────────┐               │
│  │  RETROQUEST            │               │
│  │                        │               │
│  │  [New Game]            │  ← Button     │
│  │  [Load Game]           │               │
│  │  [Options]             │               │
│  │  [Quit]                │               │
│  └────────────────────────┘               │
│                                            │
│  Properties:                               │
│  Background: [menu_bg.png]                 │
│  Position: Center                          │
│  Visible: At game start                    │
│                                            │
│  Button: "New Game"                        │
│  On Click:                                 │
│    → Hide this menu                        │
│    → Start game (Room 1)                   │
└────────────────────────────────────────────┘
```

**HUD Designer:**
```
┌────────────────────────────────────────────┐
│  HUD: In-Game                              │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────┐         │
│  │ ❤️ HP: {playerHealth}         │         │
│  │ 💰 Gold: {playerGold}         │         │
│  │                               │         │
│  │   [Game viewport here]        │         │
│  │                               │         │
│  │ 🎒 [Inventory grid]           │         │
│  └──────────────────────────────┘         │
│                                            │
│  Dynamic Text:                             │
│  HP: Variable "playerHealth"               │
│    Format: "❤️ HP: {value}/100"            │
│    Update: Always                          │
│                                            │
│  Gold: Variable "playerGold"               │
│    Format: "💰 Gold: {value}"              │
│    Update: When changed                    │
└────────────────────────────────────────────┘
```

**Keyboard Shortcuts:**
```
┌────────────────────────────────────────────┐
│  Keyboard Shortcuts            [+ Add]     │
├────────────────────────────────────────────┤
│  ESC     → Toggle pause menu               │
│  F5      → Quick save                      │
│  F9      → Quick load                      │
│  I       → Toggle inventory                │
│  Tab     → Skip dialogue                   │
│  Space   → Pause cutscene                  │
└────────────────────────────────────────────┘
```

**No GUI code! Visual UI designer!**

---

## Complete Comparison Table

| AGS Requires Code For | RetroQuest Visual Solution |
|----------------------|---------------------------|
| **1. Hotspot interactions** | Condition-Action builder with dropdowns |
| **2. Variables & flags** | Global flags panel with types |
| **3. Cutscenes** | Timeline sequence editor |
| **4. Inventory combos** | Visual recipe builder |
| **5. Dialogue trees** | Node-based graph editor |
| **6. Timers** | Visual timer system |
| **7. Pathfinding** | Click-on-canvas movement |
| **8. Object states** | State machine editor |
| **9. Random events** | Probability sliders |
| **10. Camera control** | Visual camera events |
| **11. Save/load** | Automatic save system |
| **12. GUI/menus** | Visual UI designer |
| **13. Character animations** | Animation property editor |
| **14. Room transitions** | Transition effect library |
| **15. Sound effects** | Drag-and-drop audio |
| **16. Background music** | Track assignment per room |
| **17. Conditional logic** | Visual if/then/else blocks |
| **18. Loops** | Sequence repeat options |
| **19. Math operations** | Visual number operations |
| **20. String manipulation** | Text template system |

**Every single AGS script → Visual alternative in RetroQuest!**

---

## Example: Full Game Without Code

**"The Lost Crown" - Complete game made with zero code:**

### Setup (5 minutes)
- Project name: "The Lost Crown"
- Theme: Fantasy World pack
- Resolution: 320×200

### Room 1: Tavern (10 minutes)
- Template: "Tavern Scene"
- Auto-populated: Barkeep, 3 patrons, furniture
- Customize barkeep dialogue:
  - Node 1: "Looking for work?"
  - Choice 1: "Yes" → Give quest
  - Choice 2: "No" → End conversation
- Add hotspot on door:
  - On interact → Go to "Town Square"

### Room 2: Town Square (5 minutes)
- Template: "Medieval Town"
- Add guard character
- Guard dialogue:
  - Node 1: "Halt! Need permission."
  - Condition: Has "Royal Seal"?
    - Yes → Let pass
    - No → Block

### Room 3: Castle (10 minutes)
- Template: "Castle Hall"
- Add chest object (state: closed)
  - On interact → Animate to open
  - Give item "Royal Seal"
  - Message "You found the Royal Seal!"

### Final Room: Throne (5 minutes)
- Template: "Throne Room"
- Add crown object
- Crown interaction:
  - Give item "Crown"
  - Victory message
  - End game

**Total time: 35 minutes**
**Lines of code written: 0**
**Complete, playable adventure game: ✅**

---

## Technical Implementation Notes

### How Visual Systems Generate Code

**User doesn't see code, but under the hood:**

```rust
// User creates this visually:
// IF player has "Key" THEN say "It fits!" ELSE say "Locked"

// Engine generates:
pub struct Interaction {
    conditions: Vec<Condition>,
    actions_true: Vec<Action>,
    actions_false: Vec<Action>,
}

impl Interaction {
    fn execute(&self, game: &mut GameState) {
        if self.evaluate_conditions(game) {
            for action in &self.actions_true {
                action.execute(game);
            }
        } else {
            for action in &self.actions_false {
                action.execute(game);
            }
        }
    }
}

// Serializes to JSON:
{
  "conditions": [
    {"type": "has_item", "item_id": "key"}
  ],
  "actions_true": [
    {"type": "say", "text": "It fits!"}
  ],
  "actions_false": [
    {"type": "say", "text": "Locked."}
  ]
}
```

**User never sees Rust or JSON - only visual editor!**

---

## Summary: Zero-Code Revolution

**AGS requires scripting for:**
- ❌ Complex interactions (if/else)
- ❌ Cutscenes (character movement, timing)
- ❌ Dialogue trees (branching conversations)
- ❌ Inventory combinations
- ❌ Variables and flags
- ❌ Timers and delays
- ❌ Random events
- ❌ Camera control
- ❌ Object states
- ❌ GUI updates
- ❌ Custom logic

**RetroQuest provides:**
- ✅ Visual condition-action builder
- ✅ Timeline sequence editor
- ✅ Node-based dialogue graphs
- ✅ Recipe combination system
- ✅ Visual flag manager
- ✅ Timer panel
- ✅ Probability sliders
- ✅ Camera event system
- ✅ State machine editor
- ✅ GUI designer
- ✅ Everything visual!

**Result:** Users with ZERO programming experience can create complete, complex adventure games.

---

## Sources

This analysis based on research from:

- [AGS Scripting Tutorial Part 1](https://adventuregamestudio.github.io/ags-manual/ScriptingTutorialPart1.html)
- [AGS Scripting Tutorial Part 2](https://adventuregamestudio.github.io/ags-manual/ScriptingTutorialPart2.html)
- [AGS Character Functions](https://adventuregamestudio.github.io/ags-manual/Character.html)
- [AGS Dialog Script](https://adventuregamestudio.github.io/ags-manual/DialogScript.html)
- [AGS Global Functions](https://adventuregamestudio.github.io/ags-manual/Globalfunctions_General.html)
- [AGS Global Variables](https://adventuregamestudio.github.io/ags-manual/GlobalVariables.html)

---

**RetroQuest = The ONLY adventure game maker where "no coding" actually means NO CODING.** 🚀
