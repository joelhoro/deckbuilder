# Job Description: Game Logic Agent

## Role Summary

Responsible for implementing the core deckbuilder game mechanics, turn flow, card interactions, and game state management.

---

## Responsibilities

### Primary
- Implement deckbuilder mechanics (draw, play, discard, shuffle)
- Manage game state (deck, hand, played, discard piles)
- Handle card effects and resource accumulation
- Implement turn structure (play phase → buy phase → cleanup)
- Create animations for card movements

### Secondary
- Coordinate with UI agent on visual feedback
- Update `game-design.md` when mechanics change
- Maintain code quality in `game.js`

---

## What Has Been Implemented

### Core Deckbuilder Mechanics ✅
- **Starting deck**: 10 cards (7 credit, 2 treat, 1 scout)
- **Draw system**: Draw 5 cards per turn
- **Shuffle**: When deck empty, shuffle discard into deck
- **Play cards**: Cards animate from hand → played area
- **End turn**: Played + remaining hand → discard, draw new hand

### Card Types Defined
```javascript
CARD_TYPES = {
  credit:        { effects: { credit: 1 } },
  treat:         { effects: { treat: 1 } },
  scout:         { effects: { scout: 1 } },
  advancedTreat: { effects: { treat: 2 } },
  medic:         { effects: { treat: 3 } },
  researcher:    { effects: { credit: 1, scout: 1 } },
  decontamination: { effects: { treat: 1, credit: 1 } }
}
```

### UI Features
- **Play All button**: Plays entire hand with staggered animation
- **Autoplay**: Random AI that plays cards and buys from market
- **Card animations**: Smooth transitions hand → played → discard
- **Discard pile**: Messy stack showing face-up cards, click to view all
- **Market preview**: Hover to see magnified card

### Resource System
- 💰 Credit - Buy cards from market
- 🩺 Treat - Treat visible cities
- 🔭 Scout - Reveal hidden cities

---

## Known Issues / TODOs

### Not Yet Implemented
- [ ] City card system (the 3 columns are static HTML placeholders)
- [ ] Scouting mechanic (reveal cities from column decks)
- [ ] Treating mechanic (move cities left between columns)
- [ ] Epidemic cards and escalation
- [ ] Toxic waste cards (deck pollution)
- [ ] Win/lose conditions
- [ ] Deck thinning / trash mechanic

### Bugs to Fix
- [ ] Autoplay doesn't wait for animations to complete
- [ ] Market cards don't replenish after purchase

---

## Key Files

| File | Purpose |
|------|---------|
| `game.js` | All game logic - state, mechanics, UI updates |
| `index.html` | Game layout structure |
| `styles.css` | Visual styling and animations |

---

## Instructions for Future Agents

### To Continue Game Logic Work:
1. Read `doc/game-design.md` for the full spec
2. The `gameState` object in `game.js` holds all state
3. `updateUI()` refreshes all visual elements from state
4. Card animations use `animateCardToPlayed()` and `animateCardsToDiscard()`

### To Implement City System:
1. Create city card data structure similar to `CARD_TYPES`
2. Add `cityColumns` array to `gameState` (3 columns, each with deck + visible cards)
3. Implement `scoutCity(columnIndex)` - move top of column deck to visible
4. Implement `treatCity(card)` - move city left one column
5. Update `updateUI()` to render city columns dynamically

### To Implement Win/Lose:
1. Add check in `finishTurn()` for lose conditions (toxic waste count, outbreak count)
2. Add check when treating cities for win condition (all cities cured)
3. Show game over modal with score

---

## Version History

| Date | Changes |
|------|---------|
| 2024-12-04 | Initial implementation - full deckbuilder flow working |
| 2024-12-04 | Added Play All button, discard pile popup, card previews |

