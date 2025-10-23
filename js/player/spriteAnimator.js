export class SpriteAnimator {
  constructor(sprite, frameWidth, frameHeight, cols, rows, scale = 1, animations = {}) {
    this.sprite = sprite;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.cols = cols;
    this.rows = rows;
    this.scale = scale;
    this.animations = animations; // { idle: [0], walk: [1,2,3] ... }
    this.currentAnimation = null;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 15; // lower is faster
  }

  setAnimation(name) {
    if (this.currentAnimation !== name) {
    this.currentAnimation = name;
      if (this.currentAnimation !== "jumpLeft" && this.currentAnimation !== "jumpRight") {
        this.frameIndex = 0;
        this.frameTimer = 0;
      }
     
  }
}

  update() {
    console.log(this.currentAnimation, this.frameIndex);
    if (!this.currentAnimation) return;
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      const frames = this.animations[this.currentAnimation];
      if (this.frameIndex >= frames.length) {
        if (this.currentAnimation !== "jumpLeft" && this.currentAnimation !== "jumpRight") {
          this.frameIndex = 0;
        } else {
          this.frameIndex = frames.length - 1; // hold last frame for jump
        }
      }
    }
  }

  getCurrentFrame() {
    if (!this.currentAnimation) return 0;
    const frames = this.animations[this.currentAnimation];
    return frames[this.frameIndex];
  }

  draw(ctx, x, y) {
    const frame = this.getCurrentFrame();
    const sx = (frame % this.cols) * this.frameWidth;
    const sy = Math.floor(frame / this.cols) * this.frameHeight;

    ctx.drawImage(
      this.sprite,
      sx, sy, this.frameWidth, this.frameHeight,
      x - (this.frameWidth * this.scale) / 2,
      y - this.frameHeight * this.scale,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }
}
