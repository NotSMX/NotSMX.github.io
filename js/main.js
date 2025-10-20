import { Player } from './player.js';
import { setupInput } from './input.js';
import { FLOOR_Y } from './constants.js';
import { drawAttackOptions, checkAttackHit } from './attack.js';
import { HitEffect } from './hitEffect.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

setupInput();

const sprite = new Image();
sprite.src = 'images/SMX-Sheet.png';

let player;

sprite.onload = () => {
  player = new Player(sprite, canvas, 5);
  player.setup();
  gameLoop();
};

function update() {
  if (!player) return;
  player.update();

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

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
