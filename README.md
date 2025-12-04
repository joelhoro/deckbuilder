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
│   └── game-design.md      # Full design document
├── assets/
│   └── cards/
│       ├── city-cards/     # City cards (4 colors)
│       ├── player-cards/   # Treatment, scout, specialist cards
│       ├── special/        # Epidemic, toxic waste, card back
│       ├── icons/          # Power icons
│       └── preview.html    # Card preview page
└── README.md
```

## 🚧 Status

**Design phase** — iterating on game mechanics before building the prototype.

See [`doc/game-design.md`](doc/game-design.md) for full design details and open questions.

## 🎯 Goals

- Solo play only
- Web-based (playable in browser)
- Clean, card-focused UI

## License

MIT

