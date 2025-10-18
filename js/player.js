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
    this.direction = 'right';
    this.state = 'start'; // “cutscene” animation frame
    this.canMove = false; // no input until intro ends

    this.totalFrames = 6;
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.scaledWidth = 0;
    this.scaledHeight = 0;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 10;
    

    // Cutscene timer: 2 seconds
    setTimeout(() => {
      this.canMove = true;
      this.state = 'idle';
    }, 2000);
  }

  setup() {
    this.frameWidth = this.sprite.width / this.totalFrames;
    this.frameHeight = this.sprite.height;
    this.scaledWidth = this.frameWidth * this.scale;
    this.scaledHeight = this.frameHeight * this.scale;
  }

  update() {
    // During intro, only apply gravity, no input
    if (!this.canMove) {
      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= FLOOR_Y) {
        this.y = FLOOR_Y;
        this.vy = 0;
      }
      return;
    }

    if (keys['ArrowLeft']) {
      this.vx -= ACCEL;
      this.direction = 'left';
      if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED;
      if (this.state !== 'attack') this.state = 'move';
    } else if (keys['ArrowRight']) {
      this.vx += ACCEL;
      this.direction = 'right';
      if (this.vx > MAX_SPEED) this.vx = MAX_SPEED;
      if (this.state !== 'attack') this.state = 'move';
    } else {
      // Apply friction when no keys pressed
      this.vx *= FRICTION;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
      if (this.state !== 'attack') this.state = 'idle';
    }


    // Jump
    if (keys['ArrowUp'] && this.y >= FLOOR_Y) {
      this.vy = JUMP_STRENGTH;
    }

    // Attack
    if (keys[' ']) {
      this.state = 'attack';
    } else if (this.state === 'attack') {
      this.state = 'idle';
    }

    // Apply gravity and physics
    this.vy += GRAVITY;
    this.y += this.vy;
    this.x += this.vx;

    // Floor collision
    if (this.y >= FLOOR_Y) {
      this.y = FLOOR_Y;
      this.vy = 0;
    }

    // Animation frame update
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }
  }

  draw(ctx) {
    if (!this.frameWidth || !this.frameHeight) return;

    let animFrame;
    switch (this.state) {
      case "start": animFrame = 0; break; // intro frame
      case "idle": animFrame = this.direction === 'right' ? 1 : 2; break;
      case "move": animFrame = this.direction === 'right' ? 4 : 3; break;
      case "attack": animFrame = 5; break;
      default: animFrame = 1;
    }

    ctx.drawImage(
      this.sprite,
      animFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight,
      this.x - this.scaledWidth / 2, // center horizontally
      this.y - this.scaledHeight,    // stand on ground
      this.scaledWidth, this.scaledHeight
    );
  }
}
