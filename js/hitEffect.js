export class HitEffect {
  constructor(x, y, spriteSheet, frameWidth = 350, frameHeight = 350, frameCount = 8, frameSpeed = 4) {
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frameSpeed = frameSpeed;
    this.currentFrame = 0;
    this.ticks = 0;
    this.finished = false;
    this.rotation = Math.random() * 2 * Math.PI;
  }

  update() {
    this.ticks++;
    if (this.ticks % this.frameSpeed === 0) {
      this.currentFrame++;
      if (this.currentFrame >= this.frameCount) {
        this.finished = true;
      }
    }
  }

  draw(ctx) {
    if (this.finished) return;
    const sx = this.currentFrame * this.frameWidth;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
      this.spriteSheet,
      sx, 0, this.frameWidth, this.frameHeight,
      this.x - this.frameWidth / 4,
      this.y - this.frameHeight / 4,
      this.frameWidth / 2,
      this.frameHeight / 2
    );
    ctx.restore();
  }
}
