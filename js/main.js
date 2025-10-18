const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load sprite sheet
const sprite = new Image();
sprite.src = 'SMX-Sheet.png'; // adjust path if needed
console.log("Sprite loaded:", sprite.width, sprite.height);

// Sprite details
const frameWidth = 84;
const frameHeight = 68;
const scale = 5; // 500%
const scaledWidth = frameWidth * scale;
const scaledHeight = frameHeight * scale;

// Player state
let x = 0;
let y = 0;
let direction = 'right';
let state = 'idle'; // start | idle | move | attack

const attackOptions = document.getElementById('attack-options');

// Input handling
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update() {
  if (keys['ArrowLeft']) {
    x -= 5;
    state = 'move';
    direction = 'left';
  } else if (keys['ArrowRight']) {
    x += 5;
    state = 'move';
    direction = 'right';
  } else if (keys[' ']) { // spacebar attack
    state = 'attack';
    showAttackOptions();
  } else {
    state = 'idle';
    hideAttackOptions();
  }
}

function showAttackOptions() {
  attackOptions.classList.remove('hidden');
  attackOptions.innerHTML = `
    <a href="page1.html" class="attack-link">⚡ Combo 1</a>
    <a href="page2.html" class="attack-link">🔥 Combo 2</a>
    <a href="page3.html" class="attack-link">💥 Combo 3</a>
  `;
}