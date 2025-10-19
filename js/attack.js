import { AttackOption } from './attackOption.js';

// Create options once, fixed positions
export const attackOptions = [
  new AttackOption("Art", 10, 300, 100, 40, "page1.html", 30),
  new AttackOption("Animation", 690, 300, 100, 40, "page2.html", 50),
  new AttackOption("Code", 350, 100, 100, 40, "page3.html", 20)
];

export function drawAttackOptions(ctx) {
  attackOptions.forEach(option => option.draw(ctx));
}

export function checkAttackHit(player) {
  if (player.state !== 'attack') return;

  const playerHitbox = player.getAttackHitbox();
  if (!playerHitbox) return;

  // Only register hit once per attack
  if (!player.hitRegistered) {
    attackOptions.forEach(option => {
      if (!option.hit && option.checkCollision(
        playerHitbox.x,
        playerHitbox.y,
        playerHitbox.width,
        playerHitbox.height
      )) {
        option.onHit();
        player.hitRegistered = true; // mark as hit
      }
    });
  }
}


