import { keys } from './input.js';
import { attackOptions } from './attack.js';
import { GRAVITY, FLOOR_Y, JUMP_STRENGTH, MAX_SPEED, ACCEL, FRICTION} from './constants.js';

export class Player {
  constructor(sprite, canvas, scale = 0.5) {
    this.sprite = sprite;
    this.scale = scale;
    this.canvas = canvas;

    this.x = canvas.width / 2; // start centered
    this.y = FLOOR_Y + 100;          // on the ground
    this.vx = 0;
    this.vy = 0;
    this.direction = 'left';
    this.prevDirection = this.direction;
    this.turning = false;
    this.state = 'start'; // “cutscene” animation frame
    this.canMove = false; // no input until intro ends
    this.totalFrames = 52;
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.scaledWidth = 0;
    this.scaledHeight = 0;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 20; // lower is faster
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
      attack: [37],
      jumpLeft: [38,39,40,41,42,43,44],
      jumpRight: [45,46,47,48,49,50,51]
    };
  }

  setup() {
    this.frameWidth = this.sprite.width / this.totalFrames;
    this.frameHeight = this.sprite.height;
    this.scaledWidth = this.frameWidth * this.scale;
    this.scaledHeight = this.frameHeight * this.scale;
  }

  update() {
  // During start animation
    if (this.state === 'start') {
      this.frameTimer++;
      if (this.frameTimer >= this.frameSpeed) {
        this.frameTimer = 0;
        this.frameIndex++;

        // If finished last frame of start animation
        if (this.frameIndex >= this.animations.start.length) {
          this.setState('idle');
        }
      }

      // Apply gravity while in start animation
      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= FLOOR_Y) {
        this.y = FLOOR_Y;
        this.vy = 0;
      }

      return; // skip input until start finishes
    }
    // Detect input
    if (keys['ArrowLeft']) {
      this.vx -= ACCEL;
      if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED;

      // Only trigger turning animation if NOT jumping
      if (this.direction === 'right' && Math.abs(this.vx) >= MAX_SPEED - 0.5 && this.state !== 'jump') {
        this.setState('rightToLeft');
        this.turning = true;
      } else {
        this.direction = 'left';
        // Only set to move if not turning, not attacking, and not jumping
        if (!this.turning && this.state !== 'attack' && this.state !== 'jump') {
          this.setState('move');
        }
      }

    } else if (keys['ArrowRight']) {
      this.vx += ACCEL;
      if (this.vx > MAX_SPEED) this.vx = MAX_SPEED;

      if (this.direction === 'left' && Math.abs(this.vx) >= MAX_SPEED - 0.5 && this.state !== 'jump') {
        this.setState('leftToRight');
        this.turning = true;
      } else {
        this.direction = 'right';
        if (!this.turning && this.state !== 'attack' && this.state !== 'jump') {
          this.setState('move');
        }
      }

    } else {
      // No input, apply friction
      this.vx *= FRICTION;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;

      // Only return to idle if not turning, attacking, or jumping
      if (!this.turning && this.state !== 'attack' && this.state !== 'jump') {
        this.setState('idle');
      }
    }


    // Jump
    if (keys['ArrowUp'] && this.y >= FLOOR_Y) {
      this.vy = JUMP_STRENGTH;
      this.setState('jump');
    }

    // Attack
    if (keys[' ']) {
      this.setState('attack');
    } else if (this.state === 'attack') {
      this.setState('idle');
    }

    // Apply physics
    this.vy += GRAVITY;
    this.y += this.vy;
    this.x += this.vx;

    // Floor collision
    if (this.y >= FLOOR_Y) {
      this.y = FLOOR_Y;
      this.vy = 0;

      // When landing, return to idle/move
      if (this.state === 'jump') {
        this.setState('idle');
      }
    }

    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      const currentAnim = this.getCurrentAnimation();
      this.frameIndex++;

      console.log(this.state,this.frameIndex,currentAnim.length);
      if (this.frameIndex >= currentAnim.length) {
        if (this.turning) {
          if (this.state === 'leftToRight') {
            this.turning = false;
            this.direction = 'right';
            this.frameIndex = 26; // resume mid-run
            this.setState('move');
            
          } 
          else if (this.state === 'rightToLeft') {
            this.turning = false;
            this.direction = 'left';
            this.frameIndex = 11; // resume mid-run
            this.setState('move');
            
          }
        } else {
          // Normal loop for idle/move/attack
          this.frameIndex = 0;
        }
      }
    }
  }


  draw(ctx) {
    if (!this.frameWidth || !this.frameHeight) return;

    const currentAnim = this.getCurrentAnimation();
    const animFrame = currentAnim[this.frameIndex];

    ctx.drawImage(
      this.sprite,
      animFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight,
      this.x - this.scaledWidth / 2,
      this.y - this.scaledHeight,
      this.scaledWidth, this.scaledHeight
    );
  }

  getCurrentAnimation() {
    switch (this.state) {
      case 'start': return this.animations.start;
      case 'idle': return this.direction === 'right' ? this.animations.idleRight : this.animations.idleLeft;
      case 'move':
        if (this.direction === 'right') {
          return Math.abs(this.vx) < MAX_SPEED ? this.animations.moveRightStartUp : this.animations.moveRight;
        } else {
          return Math.abs(this.vx) < MAX_SPEED ? this.animations.moveLeftStartUp : this.animations.moveLeft;
        }
      case 'leftToRight': return this.animations.leftToRight;
      case 'rightToLeft': return this.animations.rightToLeft;
      case 'jump': return this.direction === 'right' ? this.animations.jumpRight : this.animations.jumpLeft;
      case 'attack': return this.animations.attack;
      default: return this.animations.idleRight;
    }
  }


  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.frameIndex = 0;
      this.frameTimer = 0;
    }
  }
}
