# Job Description: Backend Engineer

## Role Summary

Responsible for designing and implementing **game state management** with support for:
- Full game state serialization and deserialization
- Deterministic replay from seed + action log
- Rewind/undo functionality
- Save/load games
- Complete game reconstitution

---

## Current State Analysis

### What Exists
- `gameState` object in `game.js` tracks deck, hand, played, discard piles
- Basic deckbuilder mechanics (draw, play, discard, shuffle)
- Uses `Math.random()` - **non-deterministic** (cannot replay)
- No action logging
- City columns are static HTML placeholders

### Problems to Solve
1. **Non-deterministic**: `Math.random()` cannot be seeded; same actions yield different results
2. **No action history**: Cannot replay or undo
3. **State not serializable**: Contains DOM references and transient data mixed with game state
4. **Incomplete state**: City system not implemented in JS

---

## Proposed Architecture

### 1. Seeded Pseudo-Random Number Generator (PRNG)

Replace `Math.random()` with a seeded PRNG. **Mulberry32** is simple, fast, and produces good distribution:

```javascript
/**
 * Mulberry32 PRNG - deterministic random from 32-bit seed
 * Same seed + same sequence of calls = same results every time
 */
function createRNG(seed) {
  let state = seed >>> 0; // Ensure 32-bit unsigned
  
  return {
    // Get current state (for serialization)
    getState: () => state,
    
    // Set state (for deserialization)
    setState: (s) => { state = s >>> 0; },
    
    // Get next random float [0, 1)
    random: () => {
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    
    // Get random integer [0, max)
    randomInt: function(max) {
      return Math.floor(this.random() * max);
    },
    
    // Shuffle array in place (Fisher-Yates)
    shuffle: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = this.randomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  };
}
```

### 2. Game State Schema

Separate **persistent game state** from **transient UI state**:

```javascript
/**
 * PERSISTENT GAME STATE
 * Everything needed to fully reconstitute a game
 */
const GameState = {
  // === Meta ===
  version: "1.0.0",           // Schema version for migrations
  seed: 0,                    // Initial seed (for fresh replay)
  rngState: 0,                // Current PRNG state (for resume)
  
  // === Timing ===
  turn: 1,
  phase: "play",              // "play" | "buy" | "cleanup" | "infection"
  
  // === Player Deck System ===
  player: {
    deck: [],                 // Card IDs in draw pile (top = end of array)
    hand: [],                 // Card IDs in current hand
    played: [],               // Card IDs played this turn
    discard: [],              // Card IDs in discard pile
  },
  
  // === Accumulated Resources (reset each turn) ===
  resources: {
    credit: 0,
    treat: 0,
    scout: 0,
  },
  
  // === City System ===
  cities: {
    // Each column has a deck (hidden) and visible rows
    columns: [
      { deck: [], visible: [] },  // Column 0 (Mild)
      { deck: [], visible: [] },  // Column 1 (Moderate)
      { deck: [], visible: [] },  // Column 2 (Critical)
    ],
    cured: [],                // City IDs that were cured (Column 0 → out)
    outbreak: [],             // City IDs lost to outbreaks
  },
  
  // === Market ===
  market: {
    available: [],            // Card IDs currently in market
    supply: {},               // CardType → remaining count
  },
  
  // === Game Progress ===
  stats: {
    citiesCured: 0,
    outbreaks: 0,
    toxicWasteCount: 0,       // Number of toxic waste in player deck
  },
  
  // === Action Log ===
  actionLog: [],              // All actions taken (for replay)
  actionIndex: 0,             // Current position in log (for rewind)
};
```

### 3. Card Registry (Separate from State)

Cards are identified by ID; definitions stored separately:

```javascript
/**
 * CARD REGISTRY - immutable card definitions
 */
const CardRegistry = {
  // Player Cards
  "credit": { name: "Credit", type: "player", image: "...", effects: { credit: 1 } },
  "treat": { name: "Treat Disease", type: "player", image: "...", effects: { treat: 1 } },
  "scout": { name: "Scout", type: "player", image: "...", effects: { scout: 1 } },
  // ... etc
  
  // City Cards (unique instances)
  "city-atlanta": { name: "Atlanta", type: "city", color: "blue", image: "..." },
  "city-chicago": { name: "Chicago", type: "city", color: "blue", image: "..." },
  // ... etc
  
  // Special Cards
  "toxic-waste": { name: "Toxic Waste", type: "curse", image: "...", effects: {} },
  "epidemic": { name: "Epidemic", type: "event", image: "..." },
};

// Card instances in state reference registry by ID
// State stores: ["credit-0", "credit-1", "treat-0"]
// Runtime creates: { ...CardRegistry["credit"], instanceId: "credit-0" }
```

### 4. Action Log System

Every player choice is logged as an **Action**:

```javascript
/**
 * ACTION TYPES
 * 
 * Actions represent player choices (non-deterministic moments)
 * System events (shuffles, draws) are deterministic given seed + actions
 */
const ActionTypes = {
  // === Game Setup ===
  START_GAME: "START_GAME",           // { seed: number }
  
  // === Play Phase ===
  PLAY_CARD: "PLAY_CARD",             // { cardIndex: number }
  PLAY_ALL: "PLAY_ALL",               // {} (plays all cards in hand)
  
  // === Buy Phase ===  
  BUY_CARD: "BUY_CARD",               // { marketIndex: number }
  SKIP_BUY: "SKIP_BUY",               // {} (pass on buying)
  
  // === Resource Spending ===
  TREAT_CITY: "TREAT_CITY",           // { column: number, row: number }
  SCOUT_COLUMN: "SCOUT_COLUMN",       // { column: number }
  
  // === Turn Management ===
  END_TURN: "END_TURN",               // {}
  
  // === Debug/Undo ===
  UNDO: "UNDO",                       // {} (rewind to previous action)
  REDO: "REDO",                       // {} (replay undone action)
};

/**
 * Example action log:
 */
const exampleLog = [
  { type: "START_GAME", payload: { seed: 12345 }, timestamp: 1701705600000 },
  { type: "PLAY_CARD", payload: { cardIndex: 0 }, timestamp: 1701705601000 },
  { type: "PLAY_CARD", payload: { cardIndex: 1 }, timestamp: 1701705602000 },
  { type: "BUY_CARD", payload: { marketIndex: 2 }, timestamp: 1701705603000 },
  { type: "END_TURN", payload: {}, timestamp: 1701705604000 },
  // ...
];
```

### 5. Game Engine (Pure Functions)

Separate game logic from UI. Actions produce new state:

```javascript
/**
 * GAME ENGINE - pure functions, no side effects
 * 
 * Given state + action → new state
 * Deterministic: same inputs = same outputs
 */

function applyAction(state, action, rng) {
  // Clone state to avoid mutation
  const newState = deepClone(state);
  
  switch (action.type) {
    case "START_GAME":
      return initializeGame(action.payload.seed);
      
    case "PLAY_CARD":
      return playCard(newState, action.payload.cardIndex);
      
    case "BUY_CARD":
      return buyCard(newState, action.payload.marketIndex);
      
    case "END_TURN":
      return endTurn(newState, rng);
      
    case "TREAT_CITY":
      return treatCity(newState, action.payload.column, action.payload.row);
      
    case "SCOUT_COLUMN":
      return scoutColumn(newState, action.payload.column);
      
    default:
      console.warn(`Unknown action: ${action.type}`);
      return newState;
  }
}

/**
 * Replay entire game from seed + action log
 */
function replayGame(seed, actions) {
  const rng = createRNG(seed);
  let state = initializeGame(seed);
  
  for (const action of actions) {
    state = applyAction(state, action, rng);
  }
  
  return state;
}

/**
 * Replay to specific point (for rewind)
 */
function replayToAction(seed, actions, targetIndex) {
  const rng = createRNG(seed);
  let state = initializeGame(seed);
  
  for (let i = 0; i < targetIndex && i < actions.length; i++) {
    state = applyAction(state, actions[i], rng);
  }
  
  return state;
}
```

### 6. Serialization Format

For save/load and sharing replays:

```javascript
/**
 * SAVE FILE FORMAT
 * 
 * Minimal: Just seed + actions (can replay to any point)
 * Full: Includes current state snapshot (faster load)
 */

// Minimal save (smallest, requires replay)
const minimalSave = {
  version: "1.0.0",
  seed: 12345,
  actions: [/* action log */],
};

// Full save (includes state snapshot)
const fullSave = {
  version: "1.0.0",
  seed: 12345,
  actions: [/* action log */],
  snapshot: {/* current GameState */},
  rngState: 98765,  // PRNG state for resume
};

// Serialize to JSON string
function saveGame(state, actions) {
  return JSON.stringify({
    version: "1.0.0",
    seed: state.seed,
    actions: actions,
    snapshot: state,
    rngState: state.rngState,
    savedAt: Date.now(),
  });
}

// Load game
function loadGame(saveString) {
  const save = JSON.parse(saveString);
  
  // Version migration if needed
  if (save.version !== "1.0.0") {
    return migrateFromVersion(save);
  }
  
  // Use snapshot if available, otherwise replay
  if (save.snapshot) {
    return {
      state: save.snapshot,
      actions: save.actions,
      rng: createRNGFromState(save.rngState),
    };
  }
  
  // Replay from scratch
  return {
    state: replayGame(save.seed, save.actions),
    actions: save.actions,
    rng: createRNG(save.seed),
  };
}
```

### 7. Undo/Redo Implementation

```javascript
/**
 * UNDO/REDO SYSTEM
 * 
 * Leverages action log + replay for perfect undo
 */

class GameSession {
  constructor(seed = Date.now()) {
    this.seed = seed;
    this.rng = createRNG(seed);
    this.actions = [];
    this.undoneActions = [];  // Stack for redo
    this.state = initializeGame(seed);
  }
  
  // Execute action and log it
  dispatch(action) {
    this.actions.push({ ...action, timestamp: Date.now() });
    this.undoneActions = [];  // Clear redo stack on new action
    this.state = applyAction(this.state, action, this.rng);
    return this.state;
  }
  
  // Undo last action (replay to previous point)
  undo() {
    if (this.actions.length === 0) return this.state;
    
    const undoneAction = this.actions.pop();
    this.undoneActions.push(undoneAction);
    
    // Replay from beginning to current point
    this.rng = createRNG(this.seed);
    this.state = replayGame(this.seed, this.actions);
    
    return this.state;
  }
  
  // Redo last undone action
  redo() {
    if (this.undoneActions.length === 0) return this.state;
    
    const action = this.undoneActions.pop();
    return this.dispatch(action);
  }
  
  // Save current game
  save() {
    return saveGame(this.state, this.actions);
  }
  
  // Load saved game
  static load(saveString) {
    const { state, actions, rng } = loadGame(saveString);
    const session = new GameSession(state.seed);
    session.state = state;
    session.actions = actions;
    session.rng = rng;
    return session;
  }
}
```

---

## File Structure Proposal

```
deckbuilder/
├── src/
│   ├── engine/
│   │   ├── rng.js           # Seeded PRNG
│   │   ├── state.js         # GameState schema & helpers
│   │   ├── actions.js       # Action types & creators
│   │   ├── reducer.js       # Pure state transitions
│   │   └── session.js       # GameSession class
│   ├── cards/
│   │   ├── registry.js      # Card definitions
│   │   └── effects.js       # Card effect implementations
│   ├── ui/
│   │   └── renderer.js      # DOM updates from state
│   └── game.js              # Main entry, wires everything
├── doc/
│   └── ... (unchanged)
└── ... (unchanged)
```

---

## Migration Plan

### Phase 1: Add PRNG (Non-Breaking)
1. Create `rng.js` with seeded random
2. Replace `Math.random()` calls in `game.js`
3. Add seed to game initialization

### Phase 2: Restructure State
1. Separate persistent state from UI state
2. Add action logging to existing functions
3. Test that actions replay correctly

### Phase 3: Implement Replay/Undo
1. Create `GameSession` class
2. Wire up undo button
3. Add save/load UI

### Phase 4: City System
1. Move cities from HTML to state
2. Implement scout/treat actions
3. Add epidemic logic

---

## Open Questions

1. **Storage backend**: LocalStorage for now? IndexedDB for larger saves?
2. **Replay speed**: Should replay be instant or animate through?
3. **Checkpoint frequency**: Save PRNG state every N actions for faster rewind?
4. **Multiplayer future**: Would need server-authoritative state validation

---

## Instructions for Future Agents

### To Continue This Work:
1. Read this document and `doc/game-design.md`
2. Start with Phase 1 (PRNG) - it's non-breaking
3. Test extensively: same seed must produce same game
4. Use worktree for changes: `git worktree add ../deckbuilder-backend -b feature/game-state`

### Testing Determinism:
```javascript
// Two games with same seed must be identical
const game1 = new GameSession(12345);
const game2 = new GameSession(12345);

// Apply same actions
[action1, action2, action3].forEach(a => {
  game1.dispatch(a);
  game2.dispatch(a);
});

// States must match
assert(JSON.stringify(game1.state) === JSON.stringify(game2.state));
```

---

## Version History

| Date | Changes |
|------|---------|
| 2025-12-04 | Initial design document - PRNG, state schema, action log, replay architecture |


