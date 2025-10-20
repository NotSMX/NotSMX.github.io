import { keys } from '../input.js';
import { LightAttackHitboxes, HeavyAttackHitboxes } from './hitBoxes.js';
import { FRICTION, FLOOR_Y } from '../constants.js';

export class PlayerAttack {
  constructor(player) {
    this.player = player;
    this.spaceBarHeld = false;
  }

  update() {
    const p = this.player;

    if (keys[' '] && p.y >= FLOOR_Y && !this.spaceBarHeld && !p.isAttacking) {
      p.setState('attack');
      p.isAttacking = true;
      this.spaceBarHeld = true;
      p.turning = false;
    }
    if (!keys[' ']) this.spaceBarHeld = false;
    if (!p.isAttacking) return;

    
    p.vx *= FRICTION;
    p.x += p.vx;

    const animName = p.spriteAnimator.currentAnimation;
    const animFrames = p.spriteAnimator.animations[animName];

    // Combo logic: check for space press mid-animation
    if (!this.spaceBarHeld && keys[' '] && p.spriteAnimator.frameIndex >= 2 && p.y >= FLOOR_Y) {
      if (p.state !== 'heavyAttack') {
        if (p.state === 'attack') p.setState('mediumAttack');
        else if (p.state === 'mediumAttack') p.setState('heavyAttack');
        p.spriteAnimator.frameIndex = 0;
        p.hitRegistered = false;
        this.spaceBarHeld = true;
        return;
      }
    }

    // Check if attack animation finished
    if (p.spriteAnimator.frameIndex >= animFrames.length - 1) {
      p.isAttacking = false;
      p.setState('idle');
    }
  }


  getHitbox() {
    const p = this.player;
    if (!['attack', 'mediumAttack', 'heavyAttack'].includes(p.state)) return null;
    const data = p.state === 'heavyAttack' ? HeavyAttackHitboxes[p.spriteAnimator.frameIndex] : LightAttackHitboxes[p.spriteAnimator.frameIndex];

    if (!data) return null;
    let { offsetX, offsetY, width, height } = data;
    if (p.direction === 'left') offsetX = -offsetX - width;
    return { x: p.x + offsetX, y: p.y + offsetY, width, height };
  }
}
