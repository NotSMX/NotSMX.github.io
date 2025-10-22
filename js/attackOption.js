import { GRAVITY, FLOOR_Y, JUMP_STRENGTH, MAX_SPEED, ACCEL, FRICTION} from './constants.js';

export class AttackOption {
  constructor(text, x, y, width, height, link, hp = 3) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.tempx = x;
    this.tempy = y;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.link = link;
    this.maxHp = hp;     
    this.hp = hp;  
    this.hit = false;
  }

  draw(ctx) {
    // Draw background
    ctx.fillStyle = this.hit ? "#0f0" : "#ffcc00";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw text
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${this.text} `, this.x + this.width / 2, this.y + this.height / 2);

    const barWidth = this.width;
    const barHeight = 5;
    ctx.fillStyle = "#555";
    ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
    ctx.fillStyle = "#f00";
    ctx.fillRect(this.x, this.y - 10, barWidth * (this.hp / this.maxHp), barHeight);
  }

  update() {
    // If knockback is active, apply velocity
    if (this.knockbacking) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy *= GRAVITY; // small gravity effect
      this.vx *= 0.9; // friction

      // stop when near original position
      if (Math.abs(this.x - this.tempx) < 1 && Math.abs(this.y - this.tempy) < 1) {
        this.x = this.tempx;
        this.y = this.tempy;
        this.vx = 0;
        this.vy = 0;
        this.knockbacking = false;
      } else {
        // Smoothly ease back to original position if displaced slightly
        this.x += (this.tempx - this.x) * 0.1;
        this.y += (this.tempy - this.y) * 0.1;}
    }
  }

  checkCollision(playerX, playerY, playerWidth, playerHeight) {
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }

  onHit(direction = 1) {
    this.knockbacking = true;
    this.vx = Math.random() * 5 * direction; // push left or right
    this.vy = Math.random() * 4 - 2;
    if (this.hp > 0) {
      this.hp--;
    }
    if (this.hp <= 0 && !this.hit) {
      this.hit = true;
      window.location.href = this.link; // navigate when HP reaches 0
    }
  }
}
