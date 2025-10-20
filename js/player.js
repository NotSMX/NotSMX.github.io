import { keys } from './input.js';
import { attackOptions } from './attack.js';
import { GRAVITY, FLOOR_Y, JUMP_STRENGTH, MAX_SPEED, ACCEL, FRICTION} from './constants.js';

export class Player {
  constructor(sprite, canvas, scale = 0.5) {
    this.sprite = sprite;
    this.scale = scale;
    this.canvas = canvas;
    this.x = canvas.width / 2; // start centered
    this.y = FLOOR_Y + 100; // on the ground
    this.vx = 0;
    this.vy = 0;
    this.direction = 'left';
    this.prevDirection = this.direction;
    this.turning = false;
    this.state = 'start'; // “cutscene” animation frame
    this.canMove = false; // no input until intro ends
    this.totalFrames = 97;
    this.frameWidth = 750;
    this.frameHeight = 340;
    this.scale = 0.5;
    this.scaledWidth = this.frameWidth * this.scale;
    this.scaledHeight = this.frameHeight * this.scale;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.hitRegistered = false;
    this.isAttacking = false;
    this.spaceBarHeld = false;
    this.frameSpeed = 15; // lower is faster
    this.animations = {
      start: [0,1,2,3,4,5,6], 
      idleLeft: [7],
      moveLeftStartUp: [8,9,10],
      moveLeft: [11,12,13,14,15,16], 
      leftToRight: [17,18,19,20,21],
      idleRight: [22], 
      moveRightStartUp: [23,24,25],
      moveRight: [26,27,28,29,30,31],
      rightToLeft: [32,33,34,35,36],          
      jumpLeft: [37,38,39,40,41,42,43],
      jumpRight: [44,45,46,47,48,49,50],
      lightAttackLeft: [51,52,53,54,55,56],
      lightAttackRight: [57,58,59,60,61,62],
      mediumAttackLeft: [63,64,65,66,67,68,69,70],
      mediumAttackRight: [71,72,73,74,75,76,77,78],
      heavyAttackLeft: [79,80,81,82,83,84,85,86,87],
      heavyAttackRight: [88,89,90,91,92,93,94,95,96],
    };
    this.attackHitboxes = {
      // frameIndex: { offsetX, offsetY, width, height }
      1: { offsetX: 30, offsetY: -150, width: 60, height: 125 },
      2: { offsetX: 60, offsetY: -150, width: 60, height: 125 },
    };
    this.heavyAttackHitboxes = {
      // frameIndex: { offsetX, offsetY, width, height }
      3: { offsetX: 30, offsetY: -125, width: 100, height: 60 },
      4: { offsetX: 60, offsetY: -125, width: 100, height: 60 },
    };
  }

  setup() {
    this.cols = 10; // 10 frames per row
    this.rows = 10; // 10 rows
    this.scaledWidth = this.frameWidth * this.scale;
    this.scaledHeight = this.frameHeight * this.scale;
  }

  update() {
    // START ANIMATION
    if (this.state === 'start') {
      this.frameTimer++;
      if (this.frameTimer >= this.frameSpeed) {
        this.frameTimer = 0;
        this.frameIndex++;
        if (this.frameIndex >= this.animations.start.length) {
          this.setState('idle');
        }
      }

      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= FLOOR_Y) {
        this.y = FLOOR_Y;
        this.vy = 0;
      }
      return;
    }

    // --- ATTACK INPUT --- //
    if (keys[' '] && this.y >= FLOOR_Y && !this.spaceBarHeld && !this.isAttacking) { 
      this.setState('attack'); 
      this.isAttacking = true; 
      this.spaceBarHeld = true;
    } 

    // --- ATTACK LOCK ---
    if (this.isAttacking) {
      this.turning = false; 
      this.vx *= FRICTION;
      this.x += this.vx;
      if(!this.spaceBarHeld) {
        if (keys[' '] && this.y >= FLOOR_Y && this.frameIndex >= 2) {
          if(this.state === 'mediumAttack') {
            this.setState('heavyAttack'); // restart attack animation
            this.frameIndex = 0;
            this.hitRegistered = false; // reset hit
            this.spaceBarHeld = true;
          }
          else if(this.state === 'attack') {
            this.setState('mediumAttack'); // restart attack animation
            this.frameIndex = 0;
            this.hitRegistered = false; // reset hit
            this.spaceBarHeld = true;
          }
        }
      }
      if (!keys[' ']) {
        this.spaceBarHeld = false;
      } else {
        this.spaceBarHeld = true;
      }
      this.frameTimer++;
      if (this.frameTimer >= this.frameSpeed) {
        this.frameTimer = 0;
        const currentAnim = this.getCurrentAnimation();
        this.frameIndex++;

        if (this.frameIndex >= currentAnim.length) {
            this.isAttacking = false;
            this.frameTimer = 0;
            this.setState('idle');
          }
      }
      return; // stop here, ignore movement/jump input
    }

    if (!keys[' ']) {
      this.spaceBarHeld = false;
    } else {
      this.spaceBarHeld = true;
    }
      
    // --- MOVEMENT INPUT ---
    if (keys['ArrowLeft']) {
      this.vx -= ACCEL;
      if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED;

      if (this.direction === 'right' && Math.abs(this.vx) >= MAX_SPEED - 0.5 && this.state !== 'jump') {
        this.setState('rightToLeft');
        this.turning = true;
      } else {
        this.direction = 'left';
        if (!this.turning && this.state !== 'jump') this.setState('move');
      }

    } else if (keys['ArrowRight']) {
      this.vx += ACCEL;
      if (this.vx > MAX_SPEED) this.vx = MAX_SPEED;

      if (this.direction === 'left' && Math.abs(this.vx) >= MAX_SPEED - 0.5 && this.state !== 'jump') {
        this.setState('leftToRight');
        this.turning = true;
      } else {
        this.direction = 'right';
        if (!this.turning && this.state !== 'jump') this.setState('move');
      }

    } else {
      this.vx *= FRICTION;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
      if (!this.turning && this.state !== 'jump') this.setState('idle');
    }

    // --- JUMP ---
    if (keys['ArrowUp'] && this.y >= FLOOR_Y) {
      this.vy = JUMP_STRENGTH;
      this.setState('jump');
    }


    // --- PHYSICS ---
    this.vy += GRAVITY;
    this.y += this.vy;
    this.x += this.vx;

    if (this.y >= FLOOR_Y) {
      this.y = FLOOR_Y;
      this.vy = 0;

      if (this.state === 'jump') {
        this.frameTimer = 0;
        this.setState('idle');
      }
    }
    if (this.state !== 'idle') {
      // --- FRAME UPDATES (non-attack states) ---
      this.frameTimer++;
      if (this.frameTimer >= this.frameSpeed) {
        this.frameTimer = 0;
        const currentAnim = this.getCurrentAnimation();
        this.frameIndex++;

        if (this.frameIndex >= currentAnim.length) {
          if (this.turning) {
            if (this.state === 'leftToRight') {
              this.turning = false;
              this.direction = 'right';
              this.frameIndex = 26;
              this.setState('move');
            } else if (this.state === 'rightToLeft') {
              this.turning = false;
              this.direction = 'left';
              this.frameIndex = 11;
              this.setState('move');
            }
          } else {
            this.frameIndex = 0;
          }
        }
      }
    } else {
      this.frameIndex = 0;
    }
  }


  getCurrentAnimation() {
    switch (this.state) {
      case 'start': return this.animations.start;
      case 'idle': return this.direction === 'right' ? this.animations.idleRight : this.animations.idleLeft;
      case 'move':
        return this.direction === 'right'
          ? (Math.abs(this.vx) < MAX_SPEED ? this.animations.moveRightStartUp : this.animations.moveRight)
          : (Math.abs(this.vx) < MAX_SPEED ? this.animations.moveLeftStartUp : this.animations.moveLeft);
      case 'leftToRight': return this.animations.leftToRight;
      case 'rightToLeft': return this.animations.rightToLeft;
      case 'jump': return this.direction === 'right' ? this.animations.jumpRight : this.animations.jumpLeft;
      case 'attack': return this.direction === 'right' ? this.animations.lightAttackRight : this.animations.lightAttackLeft;
      case 'mediumAttack':
        return this.direction === 'right'
          ? this.animations.mediumAttackRight
          : this.animations.mediumAttackLeft;
      case 'heavyAttack':
        return this.direction === 'right'
          ? this.animations.heavyAttackRight
          : this.animations.heavyAttackLeft;

      default: return this.animations.idleRight;
    }
  }

  getAttackHitbox() {
    if (this.state !== 'attack' && this.state !== 'mediumAttack' && this.state !== 'heavyAttack') return null;

    let data;
    if (this.state === 'heavyAttack') {
      data = this.heavyAttackHitboxes[this.frameIndex];
    } else {
      data = this.attackHitboxes[this.frameIndex];
    }
    if (!data) return null; // no hitbox for this frame

    let { offsetX, offsetY, width, height } = data;

    // Flip horizontally if facing left
    if (this.direction === 'left') {
      offsetX = -offsetX - width;
    }

    return {
      x: this.x + offsetX,
      y: this.y + offsetY,
      width,
      height
    };
  }

  draw(ctx) {
    if (!this.frameWidth || !this.frameHeight) return;

    // // Debug draw hitbox
    // ctx.save();
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 2;
    // const playerHitbox = this.getAttackHitbox();
    // if (playerHitbox) {
    //   ctx.strokeRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height);
    // }
    // ctx.restore();

    // ctx.save();
    // ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    // ctx.strokeRect(
    //   this.x - this.scaledWidth/2,
    //   this.y - this.scaledHeight,
    //   this.scaledWidth,
    //   this.scaledHeight
    // );
    // ctx.restore();

    const currentAnim = this.getCurrentAnimation();
    const animFrame = currentAnim[this.frameIndex];

    // convert 1D index → 2D grid position in 10x10 grid
    const sx = (animFrame % this.cols) * this.frameWidth;
    const sy = Math.floor(animFrame / this.cols) * this.frameHeight;

    ctx.drawImage(
      this.sprite,
      sx, sy, this.frameWidth, this.frameHeight, // source rect
      this.x - this.scaledWidth / 2,             // destination x
      this.y - this.scaledHeight,                // destination y
      this.scaledWidth,                          // destination width
      this.scaledHeight                          // destination height
    );
  }

  setState(newState) {
    if (this.state !== newState) {
        this.state = newState;
        this.frameIndex = 0;
        this.frameTimer = 0;

        if (newState === 'attack') {
            this.hitRegistered = false; // reset on new attack
        }
    }
  }
}
