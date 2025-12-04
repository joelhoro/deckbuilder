# Integration Plan - Agent Coordination

## How We Work Together

Since each agent operates in a separate chat session, we coordinate through:

1. **Job Description Docs** - Each agent maintains their own `doc/job-description-*.md`
2. **This Integration Plan** - Shared roadmap and task assignments
3. **Git Branches** - Each agent works in their own branch, submits PRs
4. **Code Comments** - `// TODO(@agent-name): message` for cross-agent requests

---

## Current Agents

| Agent | Doc | Branch | Status |
|-------|-----|--------|--------|
| Game Logic | `job-description-game-logic.md` | `master` (direct) | ✅ Core deckbuilder done |
| Backend Engineer | `job-description-backend-engineer.md` | TBD | 📝 Design complete, not implemented |
| Reviewer | `job-description-reviewer.md` | `review/code-audit` | 👀 Reviewing |

---

## Agreed Architecture

Based on Backend Engineer's design, all agents should follow:

### State Management Pattern

```javascript
// GOOD: All game-affecting state in gameState object
gameState.deck.push(card);

// BAD: State stored elsewhere
someGlobalVariable = card;
```

### Randomness Rules

```javascript
// GAME-AFFECTING: Must use seeded RNG (when implemented)
const cardIndex = rng.randomInt(deck.length);  // Deterministic

// VISUAL-ONLY: Can use Math.random() 
const rotation = (Math.random() - 0.5) * 30;   // Just for display
```

### Action Pattern (for future undo/replay)

```javascript
// When implementing new features, structure as actions:
function doSomething(params) {
  // 1. Validate
  if (!canDoSomething(params)) return;
  
  // 2. Log action (when action system exists)
  // logAction({ type: 'DO_SOMETHING', payload: params });
  
  // 3. Mutate state
  gameState.something = newValue;
  
  // 4. Update UI
  updateUI();
}
```

---

## Integration Roadmap

### Phase 1: PRNG Foundation (Backend Engineer)
**Branch:** `feature/seeded-rng`

- [ ] Create `src/engine/rng.js` with Mulberry32 PRNG
- [ ] Replace game-affecting `Math.random()` calls in `game.js`
- [ ] Add seed to game initialization
- [ ] Test: Same seed = same shuffle results

**Files to modify:**
- `game.js` lines 184-185 (shuffleDeck)
- `game.js` lines 573, 585-586 (autoplay)

**Leave alone** (visual only):
- `game.js` lines 465-467 (discard animation)
- `game.js` lines 674-676 (discard pile rotation)

### Phase 2: City System (Game Logic Agent)
**Branch:** `feature/city-system`
**Depends on:** Phase 1 (for deterministic city shuffling)

- [ ] Add city state to `gameState`:
  ```javascript
  cities: {
    columns: [
      { deck: [], visible: [] },  // Mild
      { deck: [], visible: [] },  // Moderate  
      { deck: [], visible: [] },  // Critical
    ],
    cured: [],
    outbreak: [],
  }
  ```
- [ ] Create city card definitions (48 cities, 4 colors)
- [ ] Initialize cities into column decks at game start
- [ ] Implement `scoutCity(column)` - reveal from deck to visible
- [ ] Implement `treatCity(column, row)` - move city left
- [ ] Update `index.html` to render cities dynamically
- [ ] Connect scout/treat resources to city actions

### Phase 3: Win/Lose Conditions (Game Logic Agent)
**Branch:** `feature/win-lose`
**Depends on:** Phase 2

- [ ] Check for win: All cities cured
- [ ] Check for lose: Too many outbreaks OR too much toxic waste
- [ ] Show game over modal
- [ ] Add "New Game" button

### Phase 4: Action Logging (Backend Engineer)
**Branch:** `feature/action-log`
**Depends on:** Phase 1

- [ ] Create action types enum
- [ ] Add action logging to existing functions
- [ ] Implement `replayGame(seed, actions)`
- [ ] Wire up Undo button

### Phase 5: Save/Load (Backend Engineer)
**Branch:** `feature/save-load`
**Depends on:** Phase 4

- [ ] Implement `saveGame()` → localStorage
- [ ] Implement `loadGame()`
- [ ] Add Save/Load UI buttons

---

## Handoff Protocol

When finishing a phase:

1. **Update your job description** with what you did
2. **Check off items** in this integration plan
3. **Note any blockers** or changes to the plan
4. **Commit with clear message:** `feat(phase-N): description`

When starting work:

1. **Read this integration plan** for current status
2. **Read relevant job descriptions** for context
3. **Check dependencies** - is the previous phase done?
4. **Create your feature branch** from latest master

---

## Cross-Agent Requests

Use this section to leave messages for other agents:

### From Reviewer → Backend Engineer
- The PRNG design looks solid. When you implement, please add a simple test function we can run in console to verify determinism.
- Consider: Should we keep a separate `visualRng` for non-game-affecting randomness, or just document which calls are safe to use `Math.random()`?

### From Reviewer → Game Logic Agent
- Great work on the deckbuilder flow! The animations are smooth.
- When implementing city system, the `updateUI()` pattern you established works well - just add `renderCities()` call.
- The scout/treat resources already accumulate correctly, they just need somewhere to spend them.

### From Game Logic → Backend Engineer
*(Add messages here)*

### From Backend Engineer → Game Logic
*(Add messages here)*

---

## Open Questions

1. **City card uniqueness**: Should each city be unique (48 different cities) or generic (just color matters)?
   - Game design doc is unclear
   - Affects how we store/identify city cards

2. **Market replenishment**: Current market is static HTML. When a card is bought, should it:
   - Disappear (limited supply)?
   - Replenish from a supply deck?
   - Always be available (infinite)?

3. **Turn phases**: Should we enforce phase transitions?
   - Current: Soft phases (can play/buy anytime)
   - Strict: Must end Play phase before Buy phase

---

## Version History

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-04 | Reviewer | Initial integration plan |


