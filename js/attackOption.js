export class AttackOption {
  constructor(text, x, y, width, height, link, hp = 3) {
    this.text = text;
    this.x = x;
    this.y = y;
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

  checkCollision(playerX, playerY, playerWidth, playerHeight) {
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }

  onHit() {
    if (this.hp > 0) {
      this.hp--;
    }
    if (this.hp <= 0 && !this.hit) {
      this.hit = true;
      window.location.href = this.link; // navigate when HP reaches 0
    }
  }
}
