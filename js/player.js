import { keys } from './input.js';
import { attackOptions } from './attack.js';
import { GRAVITY, FLOOR_Y, JUMP_STRENGTH } from './constants.js';

export class Player {
  constructor(sprite, x = 100, y = 0, scale = 0.5) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.direction = 'right';
    this.state = 'idle';
    this.scale = scale;

    this.totalFrames = 6;
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.scaledWidth = 0;
    this.scaledHeight = 0;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 10;
  }

  setup() {
    this.frameWidth = this.sprite.width / this.totalFrames;
    this.frameHeight = this.sprite.height;
    this.scaledWidth = this.frameWidth * this.scale;
    this.scaledHeight = this.frameHeight * this.scale;
  }

  update() {
    // Horizontal movement
    if (keys['ArrowLeft']) {
      this.vx = -5;
      this.direction = 'left';
      if (this.state !== 'attack') this.state = 'move';
    } else if (keys['ArrowRight']) {
      this.vx = 5;
      this.direction = 'right';
      if (this.state !== 'attack') this.state = 'move';
    } else {
      this.vx = 0;
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

    // Apply gravity
    this.vy += GRAVITY;
    this.y += this.vy;
    this.x += this.vx;

    // Floor collision
    if (this.y >= FLOOR_Y) {
      this.y = FLOOR_Y;
      this.vy = 0;
    }

    // Update animation frame
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= this.totalFrames) this.frameIndex = 0;
    }
  }

  draw(ctx) {
    if (!this.frameWidth || !this.frameHeight) return;

    let animFrame;
    switch(this.state) {
      case "start": animFrame = 0; break;
      case "idle": animFrame = this.direction === 'right' ? 1 : 2; break;
      case "move": animFrame = this.direction === 'right' ? 4 : 3; break;
      case "attack": animFrame = 5; break;
      default: animFrame = 1;
    }

    ctx.drawImage(
      this.sprite,
      animFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight,
      this.x, this.y - this.scaledHeight, this.scaledWidth, this.scaledHeight
    );
  }
}
