import { AttackOption } from './attackOption.js';
import { HitEffect } from './hitEffect.js';
// Sprite and array setup
const hitSprite = new Image();
hitSprite.src = 'images/Hit-Sheet.png'; // 6 frames, 70x70 each
const hitEffects = [];

// Create options once, fixed positions
export const attackOptions = [
  new AttackOption("Art", 200, 300, 100, 40, "page1.html", 30),
  new AttackOption("Animation", 500, 300, 100, 40, "page2.html", 50),
  new AttackOption("Code", 350, 100, 100, 40, "page3.html", 20)
];
 
export function drawAttackOptions(ctx) {
  attackOptions.forEach(option => option.draw(ctx));

  // Draw + update hit effects
  for (let i = hitEffects.length - 1; i >= 0; i--) {
    hitEffects[i].update();
    hitEffects[i].draw(ctx);
    if (hitEffects[i].finished) hitEffects.splice(i, 1);
  }
}

export function checkAttackHit(player) {
  if (player.state !== 'attack' && player.state !== 'mediumAttack' && player.state !== 'heavyAttack') return;

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
        player.hitRegistered = true;

        const recoil = 5;
        // Apply recoil to player on hit
        if (player.state === 'heavyAttack') {
          if (player.direction === 'right') {
            player.vx -= recoil; 
          } else {
            player.vx += recoil;
          }
        }

        // Add hit animation at collision point
        const hitX = playerHitbox.x + playerHitbox.width / 2;
        const hitY = playerHitbox.y + playerHitbox.height / 2;

        // Optional small forward offset to make the spark appear just ahead of the fist
        const offset = Math.random() * 20; 
        const adjustedX =
          player.direction === 'right'
            ? hitX + offset
            : hitX - offset;

        hitEffects.push(new HitEffect(adjustedX, hitY, hitSprite));
      }
    });
  }
}


