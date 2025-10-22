import { SpriteAnimator } from './spriteAnimator.js';
import { PlayerAnimations } from './animations.js';
import { PlayerAttack } from './attack.js';
import { PlayerMovement } from './movement.js';
import { PlayerJump } from './jump.js';
import { PlayerPhysics } from './physics.js';
import { MAX_SPEED, FLOOR_Y } from '../constants.js';

export class Player {
  constructor(sprite, canvas, scale = 0.5) {
    this.canvas = canvas;
    this.x = canvas.width / 2;
    this.y = FLOOR_Y;
    this.vx = 0;
    this.vy = 0;
    this.direction = 'left';
    this.turning = false;
    this.state = 'start';
    this.isAttacking = false;
    this.spaceBarHeld = false;


    this.spriteAnimator = new SpriteAnimator(sprite, 750, 340, 10, 10, scale, PlayerAnimations);
    this.spriteAnimator.setAnimation('start');

    this.attack = new PlayerAttack(this);
    this.movement = new PlayerMovement(this);
    this.jump = new PlayerJump(this);
    this.physics = new PlayerPhysics(this);
  }

  setup() {
    this.setState('start');
  }

  update() {
    // Start animation
    if (this.state === 'start') {
      this.spriteAnimator.update();
      if (this.spriteAnimator.frameIndex >= this.spriteAnimator.animations.start.length - 1) {
        this.setState('idle');
      }
      return;
    }
    if (this.state == 'rightToLeft' || this.state == 'leftToRight') {
      if (this.spriteAnimator.frameIndex >= this.spriteAnimator.animations[this.state].length - 1) {
        this.turning = false;
      }
    }

    this.spriteAnimator.setAnimation(this.stateToAnimation(this.state));
    // Handle input & modules
    this.attack.update();
    if (!this.isAttacking) { 
      this.movement.update();
      this.jump.update();
      this.physics.update();
    }

    // Update sprite
    this.spriteAnimator.update();
  }

  draw(ctx) {
    // // Debug draw hitbox 
    // ctx.save(); 
    // ctx.strokeStyle = 'red'; 
    // ctx.lineWidth = 2; 
    // const playerHitbox = this.attack.getHitbox(); 
    
    // if (playerHitbox) { 
    // ctx.strokeRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height); 
    // } 
    // ctx.restore();
    this.spriteAnimator.draw(ctx, this.x, this.y);
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.spriteAnimator.setAnimation(this.stateToAnimation(newState));
      if (newState === 'attack') this.hitRegistered = false;
    }
  }

  stateToAnimation(newState) {
    switch (newState) {
      case 'start': return 'start';
      case 'idle': return this.direction === 'right' ? 'idleRight' : 'idleLeft';
      case 'move': 
        if (this.direction === 'right') {
          return Math.abs(this.vx) < MAX_SPEED ? 'moveRightStartUp' : 'moveRight';
        } else {
          return Math.abs(this.vx) < MAX_SPEED ? 'moveLeftStartUp' : 'moveLeft';
        }
      case 'leftToRight': return 'leftToRight';
      case 'rightToLeft': return 'rightToLeft';
      case 'jump': return this.direction === 'right' ? 'jumpRight' : 'jumpLeft';
      case 'attack': return this.direction === 'right' ? 'lightAttackRight' : 'lightAttackLeft';
      case 'mediumAttack': return this.direction === 'right' ? 'mediumAttackRight' : 'mediumAttackLeft';
      case 'heavyAttack': return this.direction === 'right' ? 'heavyAttackRight' : 'heavyAttackLeft';
      default: return 'idleRight';
    }
  }
}
