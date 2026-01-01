/**
 * Pandemic Deckbuilder - Game Logic
 * Implements standard deckbuilder mechanics (like Star Realms)
 */

// Card definitions
const CARD_TYPES = {
  credit: {
    name: 'Credit',
    image: 'assets/cards/player-cards/credit-card.svg',
    effects: { credit: 1 }
  },
  treat: {
    name: 'Treat Disease',
    image: 'assets/cards/player-cards/treat-disease.svg',
    effects: { treat: 1 }
  },
  scout: {
    name: 'Scout',
    image: 'assets/cards/player-cards/scout.svg',
    effects: { scout: 1 }
  },
  advancedTreat: {
    name: 'Advanced Treatment',
    image: 'assets/cards/player-cards/advanced-treatment.svg',
    effects: { treat: 2 }
  },
  medic: {
    name: 'Medic',
    image: 'assets/cards/player-cards/medic.svg',
    effects: { treat: 3 }
  },
  researcher: {
    name: 'Researcher',
    image: 'assets/cards/player-cards/researcher.svg',
    effects: { credit: 1, scout: 1 }
  },
  decontamination: {
    name: 'Decontamination',
    image: 'assets/cards/player-cards/decontamination.svg',
    effects: { treat: 1, credit: 1 }
  }
};

// Game state
const gameState = {
  turn: 1,
  phase: 'play', // 'play' | 'buy'
  
  // Player's cards
  deck: [],        // Draw pile (face down)
  hand: [],        // Current hand
  played: [],      // Cards played this turn
  discard: [],     // Discard pile
  
  // Resources accumulated this turn
  resources: {
    credit: 0,
    treat: 0,
    scout: 0
  },
  
  // Game stats
  stats: {
    citiesCured: 0,
    outbreaks: 0,
    maxOutbreaks: 8,
    toxicWaste: 0,
    maxToxicWaste: 10
  },
  
  // Autoplay
  autoplayInterval: null
};

// DOM elements (will be set on init)
let elements = {};

// ============================================
// Initialization
// ============================================

function init() {
  // Cache DOM elements
  elements = {
    creditResource: document.querySelector('.power-credit'),
    treatResource: document.querySelector('.power-treat'),
    scoutResource: document.querySelector('.power-scout'),
    handCards: document.querySelector('.hand-cards'),
    playedCards: document.querySelector('.played-cards'),
    deckStack: document.querySelector('.player-deck .deck-stack'),
    deckCount: document.querySelector('.player-deck .deck-count'),
    discardStack: document.querySelector('.discard-stack'),
    discardCount: document.querySelector('.discard-pile .deck-count'),
    marketCards: document.querySelectorAll('.market-card'),
    finishTurnBtn: document.querySelector('.btn-finish-turn'),
    endTurnBtn: document.querySelector('.btn-primary'),
    undoBtn: document.querySelector('.btn-secondary'),
    autoplayBtn: document.querySelector('.btn-autoplay'),
    playAllBtn: document.querySelector('.btn-play-all')
  };
  
  // Create starting deck (5 credits, 2 treat, 1 scout)
  createStartingDeck();
  
  // Shuffle and draw initial hand
  shuffleDeck();
  drawCards(5);
  
  // Setup event listeners
  setupEventListeners();
  
  // Initial UI update
  updateUI();
  
  console.log('🎮 Pandemic Deckbuilder initialized');
  showMessage('Game started! Play cards from your hand.');
}

function createStartingDeck() {
  gameState.deck = [];
  
  // 7 Credit cards
  for (let i = 0; i < 7; i++) {
    gameState.deck.push({ ...CARD_TYPES.credit, id: `credit-${i}` });
  }
  
  // 2 Treat cards
  for (let i = 0; i < 2; i++) {
    gameState.deck.push({ ...CARD_TYPES.treat, id: `treat-${i}` });
  }
  
  // 1 Scout card
  gameState.deck.push({ ...CARD_TYPES.scout, id: 'scout-0' });
  
  // Total: 10 cards (7 credit + 2 treat + 1 scout)
}

function setupEventListeners() {
  // Finish turn button
  if (elements.finishTurnBtn) {
    elements.finishTurnBtn.addEventListener('click', finishTurn);
  }
  if (elements.endTurnBtn) {
    elements.endTurnBtn.addEventListener('click', finishTurn);
  }
  
  // Market cards - set up click and hover preview
  elements.marketCards.forEach(card => {
    card.addEventListener('click', () => buyCard(card));
    
    // Magnified preview on hover
    card.addEventListener('mouseenter', (e) => showCardPreview(card, e));
    card.addEventListener('mouseleave', hideCardPreview);
    card.addEventListener('mousemove', (e) => moveCardPreview(e));
  });
  
  // Autoplay button
  if (elements.autoplayBtn) {
    elements.autoplayBtn.addEventListener('click', toggleAutoplay);
  }
  
  // Play all button
  if (elements.playAllBtn) {
    elements.playAllBtn.addEventListener('click', playAllCards);
  }
  
  // Deck click - peek at cards (then shuffle)
  if (elements.deckStack) {
    elements.deckStack.addEventListener('click', showDeckPopup);
    elements.deckStack.style.cursor = 'pointer';
  }
}

// ============================================
// Core Deckbuilder Mechanics
// ============================================

function shuffleDeck() {
  // Fisher-Yates shuffle
  for (let i = gameState.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
  }
  console.log('🔀 Deck shuffled');
}

function drawCards(count, animated = false, callback) {
  if (!animated) {
    // Simple draw without animation
    for (let i = 0; i < count; i++) {
      drawOneCard();
    }
    updateUI();
    if (callback) callback();
    return;
  }
  
  // Animated draw (one at a time)
  let drawn = 0;
  
  function drawNext() {
    if (drawn >= count) {
      updateUI();
      if (callback) callback();
      return;
    }
    
    if (drawOneCard()) {
      drawn++;
      animateDrawCard(() => {
        drawNext();
      });
    } else {
      updateUI();
      if (callback) callback();
    }
  }
  
  drawNext();
}

function drawOneCard() {
  // If deck is empty, shuffle discard into deck
  if (gameState.deck.length === 0) {
    if (gameState.discard.length === 0) {
      console.log('No cards to draw!');
      return false;
    }
    
    // Move discard to deck and shuffle
    // Clear discard position data so cards get new positions next time
    gameState.discard.forEach(card => {
      delete card.discardRotation;
      delete card.discardOffsetX;
      delete card.discardOffsetY;
    });
    gameState.deck = [...gameState.discard];
    gameState.discard = [];
    shuffleDeck();
    updateUI();
    showMessage('♻️ Shuffled discard pile into deck');
  }
  
  // Draw top card
  const card = gameState.deck.pop();
  if (card) {
    gameState.hand.push(card);
    return true;
  }
  return false;
}

function playCard(card, index, cardElement) {
  if (gameState.phase !== 'play') {
    showMessage('Cannot play cards now');
    return;
  }
  
  // Get the card element if not passed
  if (!cardElement) {
    cardElement = elements.handCards.children[index];
  }
  
  // Animate the card
  if (cardElement) {
    animateCardToPlayed(cardElement, card, () => {
      // Remove from hand
      gameState.hand.splice(index, 1);
      
      // Add to played pile
      gameState.played.push(card);
      
      // Apply effects
      if (card.effects) {
        for (const [resource, amount] of Object.entries(card.effects)) {
          gameState.resources[resource] = (gameState.resources[resource] || 0) + amount;
        }
      }
      
      // Update UI
      updateUI();
      
      const effectStr = Object.entries(card.effects)
        .map(([r, a]) => `+${a} ${getResourceIcon(r)}`)
        .join(' ');
      showMessage(`Played ${card.name}: ${effectStr}`);
    });
  }
}

function animateCardToPlayed(cardElement, card, callback) {
  // Get positions
  const cardRect = cardElement.getBoundingClientRect();
  const playedRect = elements.playedCards.getBoundingClientRect();
  
  // Create flying card
  const flyingCard = document.createElement('div');
  flyingCard.className = 'card flying-card';
  flyingCard.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
  flyingCard.style.cssText = `
    position: fixed;
    left: ${cardRect.left}px;
    top: ${cardRect.top}px;
    width: ${cardRect.width}px;
    height: ${cardRect.height}px;
    z-index: 1000;
    transition: all 0.3s ease-out;
    pointer-events: none;
  `;
  
  document.body.appendChild(flyingCard);
  
  // Hide original card
  cardElement.style.opacity = '0';
  
  // Calculate target position (center of played area)
  const targetX = playedRect.left + playedRect.width / 2 - cardRect.width / 2;
  const targetY = playedRect.top + playedRect.height / 2 - cardRect.height / 2;
  
  // Trigger animation
  requestAnimationFrame(() => {
    flyingCard.style.left = `${targetX}px`;
    flyingCard.style.top = `${targetY}px`;
    flyingCard.style.transform = 'scale(0.8)';
  });
  
  // Cleanup after animation
  setTimeout(() => {
    flyingCard.remove();
    callback();
  }, 300);
}

function playAllCards() {
  if (gameState.hand.length === 0) {
    showMessage('No cards in hand!');
    return;
  }
  
  if (gameState.phase !== 'play') {
    showMessage('Cannot play cards now');
    return;
  }
  
  // Play all cards with staggered animation
  const cardsToPlay = [...gameState.hand];
  let delay = 0;
  
  cardsToPlay.forEach((card, index) => {
    setTimeout(() => {
      const cardElement = elements.handCards.children[0]; // Always first since we're removing
      if (cardElement && gameState.hand.length > 0) {
        playCard(gameState.hand[0], 0, cardElement);
      }
    }, delay);
    delay += 150; // Stagger each card
  });
}

function buyCard(marketCard) {
  const cost = parseInt(marketCard.dataset.cost) || 0;
  
  if (gameState.resources.credit < cost) {
    showMessage(`Need ${cost} 💰 (have ${gameState.resources.credit})`);
    return;
  }
  
  // Deduct cost
  gameState.resources.credit -= cost;
  
  // Determine card type from image src
  const imgSrc = marketCard.querySelector('img').src;
  let cardType = null;
  
  for (const [key, value] of Object.entries(CARD_TYPES)) {
    if (imgSrc.includes(value.image.split('/').pop())) {
      cardType = { ...value, id: `${key}-${Date.now()}` };
      break;
    }
  }
  
  if (cardType) {
    // Add to discard pile (goes there immediately in most deckbuilders)
    gameState.discard.push(cardType);
    showMessage(`Bought ${cardType.name} for ${cost} 💰 → Discard`);
  }
  
  updateUI();
}

function finishTurn() {
  // Stop autoplay if running
  if (gameState.autoplayInterval) {
    toggleAutoplay();
  }
  
  // Animate played cards to discard pile
  const playedCardElements = elements.playedCards.querySelectorAll('.card');
  const handCardElements = elements.handCards.querySelectorAll('.card');
  const allCards = [...playedCardElements, ...handCardElements];
  
  if (allCards.length > 0) {
    animateCardsToDiscard(allCards, () => {
      completeFinishTurn();
    });
  } else {
    completeFinishTurn();
  }
}

function completeFinishTurn() {
  // Move played cards to discard
  gameState.discard.push(...gameState.played);
  gameState.played = [];
  
  // Move remaining hand cards to discard
  gameState.discard.push(...gameState.hand);
  gameState.hand = [];
  
  // Reset resources
  gameState.resources = { credit: 0, treat: 0, scout: 0 };
  
  // Increment turn
  gameState.turn++;
  
  // Draw new hand (animated)
  drawCards(5, true, () => {
    showMessage(`Turn ${gameState.turn} - Drew ${gameState.hand.length} cards`);
  });
}

function animateCardsToDiscard(cardElements, callback) {
  const discardRect = elements.discardStack.getBoundingClientRect();
  const targetX = discardRect.left + discardRect.width / 2;
  const targetY = discardRect.top + discardRect.height / 2;
  
  let completed = 0;
  const total = cardElements.length;
  
  cardElements.forEach((cardEl, index) => {
    const cardRect = cardEl.getBoundingClientRect();
    
    // Create flying card
    const flyingCard = cardEl.cloneNode(true);
    flyingCard.style.cssText = `
      position: fixed;
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
      z-index: 1000;
      transition: all 0.3s ease-out;
      pointer-events: none;
    `;
    document.body.appendChild(flyingCard);
    
    // Hide original
    cardEl.style.opacity = '0';
    
    // Stagger the animations
    setTimeout(() => {
      const randomRotate = (Math.random() - 0.5) * 30;
      const randomOffsetX = (Math.random() - 0.5) * 20;
      const randomOffsetY = (Math.random() - 0.5) * 20;
      flyingCard.style.left = `${targetX - cardRect.width / 2 + randomOffsetX}px`;
      flyingCard.style.top = `${targetY - cardRect.height / 2 + randomOffsetY}px`;
      flyingCard.style.transform = `rotate(${randomRotate}deg)`;
      flyingCard.style.opacity = '1';
      
      setTimeout(() => {
        flyingCard.remove();
        completed++;
        if (completed === total) {
          callback();
        }
      }, 300);
    }, index * 50);
  });
  
  // Fallback if no cards
  if (total === 0) {
    callback();
  }
}

function animateDrawCard(callback) {
  const deckRect = elements.deckStack.getBoundingClientRect();
  const handRect = elements.handCards.getBoundingClientRect();
  
  // Get the last card in hand (the one just drawn)
  const drawnCard = gameState.hand[gameState.hand.length - 1];
  if (!drawnCard) {
    if (callback) callback();
    return;
  }
  
  // Create flying card from deck
  const flyingCard = document.createElement('div');
  flyingCard.className = 'card flying-card';
  flyingCard.innerHTML = `<img src="assets/cards/special/card-back.svg" alt="Card">`;
  flyingCard.style.cssText = `
    position: fixed;
    left: ${deckRect.left}px;
    top: ${deckRect.top}px;
    width: ${deckRect.width}px;
    height: ${deckRect.height}px;
    z-index: 1000;
    transition: all 0.25s ease-out;
    pointer-events: none;
    border-radius: 8px;
    overflow: hidden;
  `;
  
  document.body.appendChild(flyingCard);
  
  // Update deck count immediately
  elements.deckCount.textContent = gameState.deck.length;
  
  // Calculate target position (center of hand area)
  const targetX = handRect.left + handRect.width / 2 - deckRect.width / 2;
  const targetY = handRect.top;
  
  // Animate to hand
  requestAnimationFrame(() => {
    flyingCard.style.left = `${targetX}px`;
    flyingCard.style.top = `${targetY}px`;
    
    // Flip to show card face mid-animation
    setTimeout(() => {
      flyingCard.querySelector('img').src = drawnCard.image;
    }, 125);
  });
  
  // Cleanup and callback
  setTimeout(() => {
    flyingCard.remove();
    updateUI();
    if (callback) callback();
  }, 250);
}

// ============================================
// Autoplay
// ============================================

function toggleAutoplay() {
  if (gameState.autoplayInterval) {
    // Stop autoplay
    clearInterval(gameState.autoplayInterval);
    gameState.autoplayInterval = null;
    if (elements.autoplayBtn) {
      elements.autoplayBtn.textContent = '🤖 Autoplay';
      elements.autoplayBtn.classList.remove('active');
    }
    showMessage('Autoplay stopped');
  } else {
    // Start autoplay
    gameState.autoplayInterval = setInterval(autoplayStep, 800);
    if (elements.autoplayBtn) {
      elements.autoplayBtn.textContent = '⏹️ Stop';
      elements.autoplayBtn.classList.add('active');
    }
    showMessage('Autoplay started...');
  }
}

function autoplayStep() {
  // If hand has cards, play one randomly
  if (gameState.hand.length > 0) {
    const randomIndex = Math.floor(Math.random() * gameState.hand.length);
    const cardElement = elements.handCards.children[randomIndex];
    playCard(gameState.hand[randomIndex], randomIndex, cardElement);
  } 
  // If hand is empty, maybe buy something or finish turn
  else {
    // Try to buy a random affordable card
    const affordableCards = Array.from(elements.marketCards).filter(card => {
      const cost = parseInt(card.dataset.cost) || 0;
      return cost <= gameState.resources.credit;
    });
    
    if (affordableCards.length > 0 && Math.random() > 0.3) {
      const randomCard = affordableCards[Math.floor(Math.random() * affordableCards.length)];
      buyCard(randomCard);
    } else {
      // Finish turn
      finishTurn();
    }
  }
}

// ============================================
// UI Updates
// ============================================

function updateUI() {
  // Resources (in power summary)
  if (elements.creditResource) elements.creditResource.textContent = gameState.resources.credit;
  if (elements.treatResource) elements.treatResource.textContent = gameState.resources.treat;
  if (elements.scoutResource) elements.scoutResource.textContent = gameState.resources.scout;
  
  // Render hand
  renderHand();
  
  // Render played cards
  renderPlayed();
  
  // Update deck count
  elements.deckCount.textContent = gameState.deck.length;
  
  // Update discard count
  elements.discardCount.textContent = gameState.discard.length;
  
  // Update discard pile visual
  updateDiscardVisual();
}

function renderHand() {
  elements.handCards.innerHTML = '';
  
  gameState.hand.forEach((card, index) => {
    const cardEl = createCardElement(card);
    cardEl.classList.add('hand-card');
    cardEl.addEventListener('click', (e) => playCard(card, index, cardEl));
    elements.handCards.appendChild(cardEl);
  });
}

function renderPlayed() {
  elements.playedCards.innerHTML = '';
  
  gameState.played.forEach(card => {
    const cardEl = createCardElement(card);
    cardEl.style.width = '72px';
    cardEl.style.height = '100px';
    cardEl.style.cursor = 'default';
    elements.playedCards.appendChild(cardEl);
  });
}

function createCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
  return cardEl;
}

function updateDiscardVisual() {
  if (gameState.discard.length > 0) {
    elements.discardStack.classList.remove('empty');
    
    // Create messy pile of cards
    let html = '<div class="discard-pile-cards">';
    
    // Show up to 5 cards in a messy arrangement (older cards underneath)
    const showCount = Math.min(gameState.discard.length, 5);
    const startIndex = Math.max(0, gameState.discard.length - showCount);
    
    for (let i = startIndex; i < gameState.discard.length; i++) {
      const card = gameState.discard[i];
      const isTop = i === gameState.discard.length - 1;
      const depth = i - startIndex;
      
      // Assign random rotation/offset ONCE when card enters discard
      // Store on the card object so it persists
      if (card.discardRotation === undefined) {
        card.discardRotation = (Math.random() - 0.5) * 35;
        card.discardOffsetX = (Math.random() - 0.5) * 25;
        card.discardOffsetY = (Math.random() - 0.5) * 25;
      }
      
      html += `
        <div class="discard-card ${isTop ? 'top-card' : ''}" 
             style="transform: rotate(${card.discardRotation}deg) translate(${card.discardOffsetX}px, ${card.discardOffsetY}px); z-index: ${depth};">
          <img src="${card.image}" alt="${card.name}">
        </div>
      `;
    }
    
    html += '</div>';
    elements.discardStack.innerHTML = html;
    
    // Add click handler to show popup
    elements.discardStack.style.cursor = 'pointer';
    elements.discardStack.onclick = showDiscardPopup;
  } else {
    elements.discardStack.classList.add('empty');
    elements.discardStack.innerHTML = '<div class="empty-slot"></div>';
    elements.discardStack.onclick = null;
    elements.discardStack.style.cursor = 'default';
  }
}

function showDiscardPopup() {
  if (gameState.discard.length === 0) return;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'discard-popup-overlay';
  overlay.onclick = () => overlay.remove();
  
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'discard-popup';
  popup.onclick = (e) => e.stopPropagation();
  
  // Header
  popup.innerHTML = `
    <div class="discard-popup-header">
      <h3>Discard Pile (${gameState.discard.length} cards)</h3>
      <button class="discard-popup-close" onclick="this.closest('.discard-popup-overlay').remove()">✕</button>
    </div>
    <div class="discard-popup-cards"></div>
  `;
  
  const cardsContainer = popup.querySelector('.discard-popup-cards');
  
  // Show all cards (newest first)
  [...gameState.discard].reverse().forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card discard-popup-card';
    cardEl.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
    cardsContainer.appendChild(cardEl);
  });
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Close on ESC
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function showDeckPopup() {
  if (gameState.deck.length === 0) {
    showMessage('Deck is empty!');
    return;
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'discard-popup-overlay deck-popup-overlay';
  
  // ESC handler reference (will be set later)
  let escHandler = null;
  
  // Shuffle deck when closing
  const closeAndShuffle = () => {
    if (escHandler) {
      document.removeEventListener('keydown', escHandler);
    }
    overlay.remove();
    shuffleDeck();
    updateUI(); // Update the deck display
    showMessage('🔀 Deck shuffled after peeking');
  };
  
  overlay.onclick = closeAndShuffle;
  
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'discard-popup deck-popup';
  popup.onclick = (e) => e.stopPropagation();
  
  // Header with warning
  popup.innerHTML = `
    <div class="discard-popup-header">
      <h3>👁️ Peek at Deck (${gameState.deck.length} cards)</h3>
      <button class="discard-popup-close">✕</button>
    </div>
    <div class="deck-warning">⚠️ Deck will be shuffled when you close this</div>
    <div class="discard-popup-cards"></div>
  `;
  
  popup.querySelector('.discard-popup-close').onclick = closeAndShuffle;
  
  const cardsContainer = popup.querySelector('.discard-popup-cards');
  
  // Show all cards in deck order (top to bottom)
  [...gameState.deck].reverse().forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card discard-popup-card';
    cardEl.innerHTML = `
      <img src="${card.image}" alt="${card.name}">
      <span class="deck-position">${index + 1}</span>
    `;
    cardsContainer.appendChild(cardEl);
  });
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Close on ESC (and shuffle)
  escHandler = (e) => {
    if (e.key === 'Escape') {
      closeAndShuffle();
    }
  };
  document.addEventListener('keydown', escHandler);
}

function getResourceIcon(resource) {
  const icons = { credit: '💰', treat: '🩺', scout: '🔭', cure: '✨', special: '⚡' };
  return icons[resource] || resource;
}

// ============================================
// Card Preview
// ============================================

let currentPreview = null;

function showCardPreview(card, event) {
  hideCardPreview();
  
  const img = card.querySelector('img');
  if (!img) return;
  
  const preview = document.createElement('div');
  preview.className = 'card-preview';
  preview.innerHTML = `<img src="${img.src}" alt="Preview">`;
  
  document.body.appendChild(preview);
  currentPreview = preview;
  
  moveCardPreview(event);
}

function moveCardPreview(event) {
  if (!currentPreview) return;
  
  const previewWidth = 180;
  const previewHeight = 250;
  const padding = 15;
  
  // Position below and to the right of cursor
  let x = event.clientX + padding;
  let y = event.clientY + padding;
  
  // Keep within viewport
  if (x + previewWidth > window.innerWidth) {
    x = event.clientX - previewWidth - padding;
  }
  if (y + previewHeight > window.innerHeight) {
    y = event.clientY - previewHeight - padding;
  }
  
  currentPreview.style.left = `${x}px`;
  currentPreview.style.top = `${y}px`;
}

function hideCardPreview() {
  if (currentPreview) {
    currentPreview.remove();
    currentPreview = null;
  }
}

// ============================================
// Messages
// ============================================

function showMessage(text) {
  console.log(text);
  
  // Remove existing toast
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #00BCD4, #9C27B0);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    z-index: 1000;
    animation: fadeInUp 0.3s ease;
    white-space: nowrap;
  `;
  toast.textContent = text;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// Start
// ============================================

document.addEventListener('DOMContentLoaded', init);
