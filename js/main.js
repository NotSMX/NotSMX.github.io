import { Player } from './player/player.js';
import { setupInput } from './input.js';
import { FLOOR_Y } from './constants.js';
import { drawAttackOptions, checkAttackHit, attackOptions } from './enemies.js';
import { HitEffect } from './hitEffect.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

setupInput();

const sprite = new Image();
sprite.src = 'images/SMX-Sheet.png';

let player;

sprite.onload = () => {
  player = new Player(sprite, canvas, 0.5);
  player.setup();
  gameLoop();
};

function update() {
  if (!player) return;
  player.update();
  attackOptions.forEach(option => option.update());

  // Check collision between player's attack and options
  checkAttackHit(player);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // Draw player
  if (player) player.draw(ctx);

  // Draw attack options (always visible)
  drawAttackOptions(ctx);
}

let lastTime = 0;
const targetFPS = 600;
const frameTime = 1000 / targetFPS;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  
  if (deltaTime >= frameTime) {
    update();
    draw();
    lastTime = timestamp;
  }
  
  requestAnimationFrame(gameLoop);
}
