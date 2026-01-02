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
├── frontend/
│   ├── assets/
│   │   └── cards/
│   │       ├── city-cards/     # City cards (4 colors: red, blue, yellow, black)
│   │       ├── player-cards/   # Treatment, scout, specialist cards
│   │       ├── special/        # Epidemic, toxic waste, card back
│   │       ├── icons/          # Power icons
│   │       └── preview.html    # Card preview page
│   ├── index.html              # Main game page
│   ├── styles.css              # Game styling
│   └── game.js                 # Game logic
├── docker/
│   ├── Dockerfile              # Production container
│   ├── Dockerfile.dev          # Development container with hot-reload
│   ├── docker-compose.yml      # Container orchestration
│   ├── manage.sh               # Unified container management script
│   ├── start-prod.sh           # Start production container
│   ├── stop-prod.sh            # Stop production container
│   ├── start-dev.sh            # Start development container
│   └── stop-dev.sh             # Stop development container
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

## 🐳 Docker Setup

The project includes Docker configurations for both production and development environments.

### Quick Start

**Production (port 7904):**
```bash
./docker/start-prod.sh
# Or use the unified script:
./docker/manage.sh prod start
```

**Development with hot-reload (port 7914):**
```bash
./docker/start-dev.sh
# Or use the unified script:
./docker/manage.sh dev start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `docker/start-prod.sh` | Start production container |
| `docker/stop-prod.sh` | Stop production container |
| `docker/start-dev.sh` | Start development container with hot-reload |
| `docker/stop-dev.sh` | Stop development container |
| `docker/manage.sh` | Unified script for all operations |

### Using the Management Script

The `docker/manage.sh` script supports multiple actions:

```bash
# Start/stop containers
./docker/manage.sh prod start
./docker/manage.sh prod stop
./docker/manage.sh dev start
./docker/manage.sh dev stop

# Restart containers
./docker/manage.sh prod restart
./docker/manage.sh dev restart

# View logs
./docker/manage.sh dev logs
./docker/manage.sh prod logs

# Check status
./docker/manage.sh prod status
./docker/manage.sh dev status
```

### Ports

- **Production**: http://localhost:7904
- **Development**: http://localhost:7914 (with hot-reload)

### Development Mode

The development container uses `live-server` with hot-reload enabled. Changes to files in `frontend/` will be automatically reflected in the browser without manual refresh.

## 🎯 Goals

- Solo play only
- Web-based (playable in browser)
- Clean, card-focused UI

## License

MIT

