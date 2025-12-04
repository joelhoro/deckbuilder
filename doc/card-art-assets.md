# Card Art Assets Documentation

> **Created:** December 4, 2024  
> **Status:** Complete - Ready for integration  
> **Location:** `/assets/cards/`

---

## Overview

This document describes the SVG card art assets created for the Pandemic Deckbuilder game. All cards follow a consistent visual language inspired by games like **Eminent Domain** and **Eschaton**, where power icons are displayed on the left edge of each card.

---

## Folder Structure

```
assets/cards/
├── icons/              # Standalone 40x40 power icons
├── player-cards/       # Cards that go in the player's deck
├── city-cards/         # City cards (4 disease colors)
├── special/            # Event cards, waste, card backs
└── preview.html        # HTML gallery to view all cards
```

---

## Iconography System

Each card displays **power icons** on the left strip. When played, these icons contribute to the player's available actions for that turn.

| Icon | File | Color | Purpose |
|------|------|-------|---------|
| 💰 Credit | `icons/credit.svg` | Gold (#FFD93D) | Currency for market purchases |
| 🩺 Treat | `icons/treat.svg` | Blue (#4FC3F7) | Treatment power - move cities left |
| 🔭 Scout | `icons/scout.svg` | Green (#81C784) | Reveal hidden cities from column decks |
| ✨ Cure | `icons/cure.svg` | Purple (#E040FB) | Bonus when curing from Column 1 |
| ⚡ Special | `icons/special.svg` | Orange (#FF7043) | Activates specialist abilities |

### Icon Placement
- Icons appear in the **left strip** (36px wide)
- Multiple icons stack vertically when a card provides multiple powers
- Icons are 32x32 within their containers

---

## Card Dimensions & Layout

All cards are **180×250 pixels** (standard card ratio ~1:1.39)

```
┌─────────────────────────────────┐
│ [ICON]  │    CARD TITLE     [¢] │  ← Title bar + cost
│ [ICON]  ├───────────────────────│
│         │                       │
│  LEFT   │    ILLUSTRATION       │  ← 120×100 art area
│  STRIP  │       AREA            │
│  36px   │                       │
│         ├───────────────────────│
│         │    EFFECT TEXT        │  ← Powers & abilities
│         │    Card Type          │  ← STARTER/MARKET/SPECIALIST
└─────────────────────────────────┘
```

---

## Card Inventory

### Starter Deck Cards (8 total)

| Card | File | Icons | Count | Notes |
|------|------|-------|-------|-------|
| Credit | `player-cards/credit-card.svg` | 💰×1 | 5 | Basic currency |
| Treat Disease | `player-cards/treat-disease.svg` | 🩺×1 | 2 | Basic treatment |
| Scout | `player-cards/scout.svg` | 🔭×1 | 1 | Reveal cities |

### Market Cards

| Card | File | Icons | Cost | Effect |
|------|------|-------|------|--------|
| Advanced Treatment | `player-cards/advanced-treatment.svg` | 🩺×3 | 4 | +3 Treat power |
| Decontamination | `player-cards/decontamination.svg` | ✨×1 | 2 | Trash 1 Toxic Waste |

### Specialist Cards

| Card | File | Icons | Cost | Special Ability |
|------|------|-------|------|-----------------|
| Medic | `player-cards/medic.svg` | 🩺×2 | 4 | Treat moves city 2 columns left |
| Researcher | `player-cards/researcher.svg` | 💰×1, ⚡×1 | 3 | Draw 2, discard 1 |
| Quarantine Specialist | `player-cards/quarantine-specialist.svg` | 🛡️×1, ⚡×1 | 5 | Block next Epidemic |

### City Cards (4 Disease Colors)

| Disease | File | City Example | Color Palette |
|---------|------|--------------|---------------|
| Blue Fever | `city-cards/city-blue.svg` | New York | #1565C0, #64B5F6 |
| Yellow Blight | `city-cards/city-yellow.svg` | Lagos | #F9A825, #FFEE58 |
| Black Plague | `city-cards/city-black.svg` | Moscow | #37474F, #78909C |
| Red Contagion | `city-cards/city-red.svg` | Tokyo | #C62828, #EF5350 |

**City Card Features:**
- Virus icon (corona-style) in left strip indicates disease type
- Unique city skyline illustrations
- Disease type label at bottom

### Special Cards

| Card | File | Purpose |
|------|------|---------|
| Toxic Waste | `special/toxic-waste.svg` | Negative card - deck pollution |
| Epidemic | `special/epidemic.svg` | Event - escalates all cities right |
| Card Back | `special/card-back.svg` | DNA helix design for face-down cards |

---

## Visual Design Language

### Color Scheme

```
Background:     #1a1a2e (dark navy)
Card Frame:     #3d3d5c (muted purple-gray)
Text Primary:   #e0e0e0 (light gray)
Text Secondary: #888888 (medium gray)

Accents by card type:
- Starter:     Neutral (card-specific accent)
- Market:      Purple (#7E57C2)
- Specialist:  Varies by role
- City:        Disease color
- Negative:    Toxic green (#76FF03) or danger red (#FF1744)
```

### Typography

- **Title:** Courier New, monospace, bold, 12-14px
- **Effect text:** Courier New, monospace, 9-11px
- **Labels:** Courier New, monospace, 8px, uppercase

### Visual Effects

- Gradients used for depth (linear, radial)
- Glow filters on important elements (virus, toxic waste)
- Consistent rounded corners (12px card, 6px inner elements)

---

## Integration Notes

### For Game Developers

1. **Loading SVGs:** All cards are self-contained SVGs with embedded gradients/filters
2. **Scaling:** Cards scale cleanly at any size (vector graphics)
3. **Hover states:** Preview HTML demonstrates CSS hover effects
4. **Card identification:** Use filename or add data attributes

### Suggested Implementation

```javascript
// Example card data structure
const card = {
  id: 'medic',
  name: 'Medic',
  type: 'specialist',
  cost: 4,
  icons: ['treat', 'treat'],
  art: '/assets/cards/player-cards/medic.svg',
  effect: '+2 Treat. SPECIAL: Treat moves city 2 columns left.'
};
```

### Preview Server

To view all cards in a gallery:
```bash
cd assets/cards
python3 -m http.server 8765
# Open http://localhost:8765/preview.html
```

---

## Future Considerations

### Cards Not Yet Created

These cards are mentioned in the game design but don't have art yet:

- [ ] **Dispatcher** specialist
- [ ] **Scout** specialist (advanced version)
- [ ] **Hazmat Specialist** (trash toxic waste variant)
- [ ] Additional city cards (only 1 per color exists)
- [ ] Color-specific treatment cards (if implemented)

### Potential Enhancements

- Animated SVGs for special effects
- Card rarity indicators
- Victory point markers
- Turn/round tracker cards

---

## Files Created

```
assets/cards/
├── icons/
│   ├── credit.svg
│   ├── cure.svg
│   ├── scout.svg
│   ├── special.svg
│   └── treat.svg
├── player-cards/
│   ├── advanced-treatment.svg
│   ├── credit-card.svg
│   ├── decontamination.svg
│   ├── medic.svg
│   ├── quarantine-specialist.svg
│   ├── researcher.svg
│   ├── scout.svg
│   └── treat-disease.svg
├── city-cards/
│   ├── city-black.svg
│   ├── city-blue.svg
│   ├── city-red.svg
│   └── city-yellow.svg
├── special/
│   ├── card-back.svg
│   ├── epidemic.svg
│   └── toxic-waste.svg
└── preview.html
```

**Total: 18 SVG files + 1 HTML preview**

---

## Related Documents

- [Game Design Document](./game-design.md) - Core mechanics and rules
- Card Iconography System is documented in the game design doc under "The Market"

