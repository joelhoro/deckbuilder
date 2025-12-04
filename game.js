/**
 * Pandemic Deckbuilder - Game Logic (Placeholder)
 */

// Game state
const gameState = {
  turn: 1,
  phase: 'play', // 'play' | 'buy' | 'cleanup'
  resources: {
    credit: 0,
    treat: 0,
    scout: 0
  },
  stats: {
    citiesCured: 0,
    outbreaks: 2,
    maxOutbreaks: 8,
    toxicWaste: 1,
    maxToxicWaste: 10
  }
};

// DOM elements
const elements = {
  turnCounter: document.querySelector('.turn-counter'),
  phaseIndicator: document.querySelector('.phase-indicator'),
  creditResource: document.querySelector('.resource.credit span'),
  treatResource: document.querySelector('.resource.treat span'),
  scoutResource: document.querySelector('.resource.scout span'),
  handCards: document.querySelectorAll('.hand-card'),
  marketCards: document.querySelectorAll('.market-card'),
  cityCards: document.querySelectorAll('.city-card'),
  endTurnBtn: document.querySelector('.btn-primary'),
  undoBtn: document.querySelector('.btn-secondary'),
  playedArea: document.querySelector('.played-cards')
};

// Initialize game
function init() {
  setupEventListeners();
  updateUI();
  console.log('🎮 Pandemic Deckbuilder initialized');
}

// Event listeners
function setupEventListeners() {
  // Hand card clicks
  elements.handCards.forEach(card => {
    card.addEventListener('click', () => playCard(card));
  });
  
  // Market card clicks
  elements.marketCards.forEach(card => {
    card.addEventListener('click', () => buyCard(card));
  });
  
  // City card clicks
  elements.cityCards.forEach(card => {
    card.addEventListener('click', () => treatCity(card));
  });
  
  // Button clicks
  elements.endTurnBtn.addEventListener('click', endTurn);
  elements.undoBtn.addEventListener('click', undo);
}

// Play a card from hand
function playCard(card) {
  if (gameState.phase !== 'play') {
    showMessage('Can only play cards during Play phase');
    return;
  }
  
  // Clone card to played area
  const clone = card.cloneNode(true);
  clone.classList.remove('hand-card');
  clone.style.width = '72px';
  clone.style.height = '100px';
  elements.playedArea.appendChild(clone);
  
  // Hide original
  card.style.opacity = '0.3';
  card.style.pointerEvents = 'none';
  
  // Add resources (placeholder - would depend on card type)
  gameState.resources.credit += 1;
  updateUI();
  
  showMessage('Card played! +1 💰');
}

// Buy a card from market
function buyCard(card) {
  const cost = parseInt(card.dataset.cost) || 0;
  
  if (gameState.resources.credit < cost) {
    showMessage(`Not enough credits! Need ${cost} 💰`);
    return;
  }
  
  gameState.resources.credit -= cost;
  updateUI();
  
  // Visual feedback
  card.style.transform = 'scale(0.9)';
  setTimeout(() => {
    card.style.transform = '';
  }, 200);
  
  showMessage(`Purchased card for ${cost} 💰`);
}

// Treat a city
function treatCity(card) {
  if (gameState.resources.treat < 1) {
    showMessage('No treat points! Play treatment cards first.');
    return;
  }
  
  gameState.resources.treat -= 1;
  updateUI();
  
  // Visual feedback
  card.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
  setTimeout(() => {
    card.style.boxShadow = '';
  }, 500);
  
  showMessage('City treated! 🩺');
}

// End turn
function endTurn() {
  gameState.turn += 1;
  gameState.phase = 'play';
  gameState.resources = { credit: 0, treat: 0, scout: 0 };
  
  // Reset hand cards
  elements.handCards.forEach(card => {
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
  });
  
  // Clear played area
  elements.playedArea.innerHTML = '';
  
  updateUI();
  showMessage(`Turn ${gameState.turn} begins!`);
}

// Undo (placeholder)
function undo() {
  showMessage('Undo not implemented yet');
}

// Update UI
function updateUI() {
  elements.turnCounter.textContent = `Turn ${gameState.turn}`;
  elements.phaseIndicator.textContent = `${gameState.phase} Phase`;
  elements.creditResource.textContent = gameState.resources.credit;
  elements.treatResource.textContent = gameState.resources.treat;
  elements.scoutResource.textContent = gameState.resources.scout;
}

// Show temporary message
function showMessage(text) {
  console.log(text);
  
  // Create toast notification
  const toast = document.createElement('div');
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

// Start
document.addEventListener('DOMContentLoaded', init);

