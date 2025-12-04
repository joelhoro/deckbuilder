# Pandemic Deckbuilder

A solo web-based deckbuilder game inspired by Pandemic mechanics. Build your deck to treat diseases across cities before toxic waste overwhelms you.

## 🎮 Concept

Combine the tension of Pandemic with deckbuilding mechanics:

- **Three columns of cities** — representing mild, moderate, and critical infection levels
- **Scout to reveal** — hidden cities must be scouted before they can be treated
- **Treat to cure** — move cities left through the columns until cured
- **Toxic waste** — outbreaks pollute your deck, making future turns harder
- **Race against time** — cure all cities before it's too late

## 🃏 Card System

Cards display power icons (Eschaton/Eminent Domain style):

| Icon | Power | Effect |
|------|-------|--------|
| 💰 | Credit | Buy new cards from the market |
| 🩺 | Treat | Move visible cities left (toward cure) |
| 🔭 | Scout | Reveal hidden cities from column decks |
| ✨ | Cure | Bonus when fully curing cities |
| ⚡ | Special | Activate specialist abilities |

## 📁 Project Structure

```
deckbuilder/
├── doc/
│   ├── game-design.md                    # Full design document
│   ├── card-art-assets.md                # Card artwork specs
│   └── job-description-*.md              # Agent job descriptions
├── assets/
│   └── cards/
│       ├── city-cards/     # City cards (4 colors: red, blue, yellow, black)
│       ├── player-cards/   # Treatment, scout, specialist cards
│       ├── special/        # Epidemic, toxic waste, card back
│       ├── icons/          # Power icons
│       └── preview.html    # Card preview page
├── index.html              # Main game page
├── styles.css              # Game styling
├── game.js                 # Game logic
└── README.md
```

## 🚧 Status

**Prototype in progress** — Core deckbuilder mechanics are working!

### ✅ Implemented
- Full deckbuilder flow (draw, play, discard, shuffle)
- Starting deck: 10 cards (7 credit, 2 treat, 1 scout)
- Market system with card purchasing
- Smooth card animations (draw, play, discard)
- Deck peek feature (auto-shuffles on close)
- Discard pile visualization (messy stack with persistent positions)
- Power resource system (💰 Credit, 🩺 Treat, 🔭 Scout)
- Play All button
- Autoplay mode for testing

### 🚧 In Progress / TODO
- City card system (3 columns with decks)
- Scouting mechanic (reveal cities from column decks)
- Treating mechanic (move cities between columns)
- Epidemic cards and escalation
- Toxic waste cards
- Win/lose conditions

See [`doc/game-design.md`](doc/game-design.md) for full design details and open questions.

## 🎯 Goals

- Solo play only
- Web-based (playable in browser)
- Clean, card-focused UI

## License

MIT

