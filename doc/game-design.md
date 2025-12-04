# Pandemic Deckbuilder - Game Design Document

## Overview

A **solo** web-based deckbuilder game inspired by Pandemic's mechanics. Build your deck to treat diseases across cities while managing escalating threats before time runs out or toxic waste overwhelms you.

---

## Core Mechanics

### Player's Starting Deck (8 cards)

| Card Type | Count | Purpose |
|-----------|-------|---------|
| Credit | 5 | Currency to buy new cards |
| Treat Disease | 2 | Treat a visible city (move it left) |
| ??? | 1 | TBD - Scout card? (reveal cities) |

### Turn Structure (Standard Deckbuilder)

1. **Play Phase** - Play cards from hand to gain credits, treat diseases, use abilities
2. **Buy Phase** - Spend credits to acquire new cards from the market
3. **Cleanup** - Discard played cards and hand, draw new hand (typically 5 cards)

---

## The Market (Cards Available for Purchase)

### Card Iconography System

Each card displays **power icons** on the left edge (Eschaton/Eminent Domain style). When you play cards, you accumulate these powers to spend during your turn:

| Icon | Power Type | What It Does |
|------|------------|--------------|
| 💰 | **Credit** | Currency to purchase cards from the market |
| 🩺 | **Treat** | Points to spend treating visible cities (moving them left) |
| 🔭 | **Scout** | Points to reveal hidden cities from column decks |
| ✨ | **Cure** | Bonus when curing cities (treating from Column 1) |
| ⚡ | **Special** | Activates specialist abilities or unique card effects |

**Design Intent:** A hand of 5 cards might show: 💰💰💰🩺🩺🔭 — giving you 3 Credit, 2 Treat, and 1 Scout to spend that turn. This creates interesting decisions about which cards to play vs. hold.

---

### Treatment Cards

Standard purchasable cards in various **colors** (matching disease types):
- Basic treatment cards (cheap, treat 1 visible city)
- Advanced treatment cards (expensive, treat multiple cities or move 2 columns left)
- Color-specific vs. color-neutral treatments?

### Scout Cards

Cards that reveal hidden cities:
- Basic scout (reveal 1 city from any column deck)
- Advanced scout (reveal multiple, or peek and choose)

### Specialists (Hire-able Characters)

Inspired by Pandemic roles:

| Specialist | Ability Ideas |
|------------|---------------|
| Medic | Treat multiple cities at once / treat moves city 2 columns left |
| Researcher | Draw extra cards / card manipulation |
| Scout | Reveal multiple cities from decks into visible rows |
| Dispatcher | Rearrange visible cities between columns? |
| Quarantine Specialist | Prevent disease spread / block escalation? |

**Open Question:** How do specialists work mechanically?
- One-time powerful effect when played?
- Persistent bonus while in deck?
- Stays in play providing ongoing effect?

---

## City Cards System

### Core Concept: No Cubes

**The stack position IS the infection level.** There are no separate disease cubes. A city in Stack 3 has 3 "diseases" simply by being there. Treating moves it left; escalation moves it right.

### The Three City Columns

Cities are distributed across **3 columns** representing disease severity:

```
         Column 1        Column 2        Column 3
         (Mild)          (Moderate)      (Critical)
        ┌────────┐      ┌────────┐      ┌────────┐
Row 3   │ [visible] │   │ [visible] │   │ [visible] │  ← Can treat these
        ├────────┤      ├────────┤      ├────────┤
Row 2   │ [visible] │   │ [visible] │   │ [visible] │  ← Can treat these
        ├────────┤      ├────────┤      ├────────┤
Row 1   │ [visible] │   │ [visible] │   │ [visible] │  ← Can treat these
        ├────────┤      ├────────┤      ├────────┤
Deck    │ [hidden]  │   │ [hidden]  │   │ [hidden]  │  ← Must scout to reveal
        │   ...     │   │   ...     │   │   ...     │
        └────────┘      └────────┘      └────────┘
```

- Shuffled at game start
- Each city card has a **color** (disease type)
- Cities can be any color regardless of column
- **Maximum 3 visible rows** per column

### Visibility & Scouting

**Only visible cities can be treated.** Cities in the deck are hidden.

**Scout action** (from cards or specialists):
- Move 1 card from the top of a column's deck → into a visible row above
- Creates tactical choices: which column to scout?
- Scouting fills rows from bottom to top (Row 1 → Row 2 → Row 3)

**When a row is full (3 cards visible in a column):**
- Cannot scout more into that column until cities are treated or moved

### Treating Cities

When you treat a visible city:
- City card moves **LEFT** (to next lower severity column)
- If treated from Column 1 → **Cured!** Goes to victory pile / score

### Disease Escalation

Cities move **RIGHT** when:
- **Epidemic cards** - Mixed into city decks, trigger escalation
- Other mechanisms TBD

**If a city in Column 3 would move right → OUTBREAK**
- City is removed (lost forever?)
- Player gains Toxic Waste cards

---

## Epidemics & Escalation

### Current Thinking

- Epidemic cards shuffled into city card decks
- When drawn: cities move RIGHT (severity increases)

### Open Questions

1. **Which cities are affected by epidemics?**
   - All cities of a certain color?
   - Top card of each stack?
   - Random selection?

2. **What triggers ongoing infection?** (In Pandemic: infection deck)
   - Separate infection phase each turn?
   - Epidemic causes "intensify" effect?
   - Cities naturally worsen over time?

3. **What happens when a city would move past Stack 3?**
   - **Outbreak equivalent** - This is the crisis moment
   - Options:
     - **Gain Toxic Waste cards** ← Current favorite, pollutes your deck
     - Game over / lose condition (if too many outbreaks)
     - Chain reaction to adjacent cities (but no board...)
     - Permanent negative effect
     - Lost victory points

---

## Toxic Waste Cards (Deck Pollution)

### Concept

Toxic Waste cards are **negative cards** that clog your deck. They represent the lasting damage from failing to contain diseases.

### How You Gain Them

- **Outbreaks** - When a city would move past Stack 3
- **Epidemics** - Possibly gain 1 toxic waste per epidemic?
- Other penalty events TBD

### The Penalty

If you have **more than X Toxic Waste cards in your hand** at the start of your turn:
- **Lose your turn entirely?**
- Or: Can only play 1 card this turn
- Or: Cannot buy cards this turn
- Or: Must discard down to 2 cards before playing

**Design Note:** This creates a "death spiral" pressure - failing to treat cities pollutes your deck, making future turns weaker, making it harder to treat cities. Players need ways to remove toxic waste (trash cards, special abilities) to stay viable.

### Removal Options

- **Hazmat Specialist** - Can trash toxic waste when played
- **Decontamination card** - Purchasable card that trashes toxic waste
- **Clinic** - Ongoing effect that slowly removes waste?

### Open Questions

1. **What's the threshold X?** (2? 3?)
2. **Exact penalty severity?** (Skip turn is harsh, reduced actions is more forgiving)
3. **How easy should removal be?** (Too easy = no threat, too hard = unfun)

---

## Win/Lose Conditions

### Win Condition
- **Cure all cities** - Empty all three columns (all cities treated out of Column 1)
- Or: Cure X number of cities before time runs out (score-based)

### Lose Conditions (Game Ends Immediately)

1. **Toxic Waste Overload**
   - If your deck contains **X or more Toxic Waste cards** → You lose
   - Threshold TBD (maybe 8-10 cards?)
   - This is the "death spiral" endpoint

2. **Time Runs Out**
   - **Option A:** Fixed number of rounds (e.g., 20 turns)
   - **Option B:** Player deck cycles - lose after N complete deck shuffles
   - **Option C:** City deck depletion - when any column's deck is empty and you'd need to draw

3. **Too Many Outbreaks** (optional)
   - If X cities are lost to outbreaks → immediate loss
   - Could combine with toxic waste (each outbreak = waste + progress toward this limit)

---

## Open Design Questions

### High Priority (Need answers to prototype)

1. **What is the 8th starting card?**
   - **Scout card?** ← Fits the new visibility mechanic
   - Wild treatment?
   - Card draw?
   - Trash a card?

2. **How do cities start / enter the system?**
   - All shuffled into column decks at start?
   - How many visible at game start? (1 per column? 0?)
   - How many cities total?

3. **Turn-by-turn infection mechanism?**
   - In Pandemic, you draw infection cards each turn
   - What's our equivalent?
   - Do visible cities automatically escalate each turn?
   - Or only via epidemics?

4. **Color system details**
   - How many colors/disease types? (Pandemic has 4)
   - Do treatment cards need to match colors?
   - Or are treatments color-neutral?

5. **Time constraint details**
   - Fixed rounds? Deck cycles? Something else?

### Medium Priority

6. **Specialist implementation**
7. **Scoring system** (for partial wins / high scores)
8. **Difficulty scaling**

### Future Considerations

9. **Campaign/progression mode?**
10. **Event cards?**

---

## Technical Notes

### Platform
- Web-based prototype
- **Solo game only** (no multiplayer planned)

### Tech Stack
- TBD based on preferences

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2024-12-04 | Initial brain dump and structure |
| 0.2 | 2024-12-04 | Added Toxic Waste cards mechanic |
| 0.3 | 2024-12-04 | No cubes - stack position IS infection; added scouting/visibility mechanic; confirmed solo game; clarified lose conditions (toxic waste + time) |

