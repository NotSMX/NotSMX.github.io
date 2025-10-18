import { AttackOption } from './attackOption.js';

// Create options once, fixed positions
export const attackOptions = [
  new AttackOption("Art", 200, 300, 100, 40, "page1.html", 30),
  new AttackOption("Animation", 400, 250, 100, 40, "page2.html", 50),
  new AttackOption("Code", 600, 200, 100, 40, "page3.html", 20)
];

export function drawAttackOptions(ctx) {
  attackOptions.forEach(option => option.draw(ctx));
}

// Check collision with player attack
export function checkAttackHit(player) {
  if (player.state !== 'attack') return;

  const playerHitbox = {
    x: player.x,
    y: player.y - player.scaledHeight,
    width: player.scaledWidth,
    height: player.scaledHeight
  };

  attackOptions.forEach(option => {
    if (!option.hit && option.checkCollision(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height)) {
      option.onHit();
    }
  });
}
