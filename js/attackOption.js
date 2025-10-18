export class AttackOption {
  constructor(text, x, y, width, height, link) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.link = link;
    this.hit = false; // whether player has hit it
  }

  draw(ctx) {
    ctx.fillStyle = this.hit ? "#0f0" : "#ffcc00"; // green if hit
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  checkCollision(playerX, playerY, playerWidth, playerHeight) {
    // Simple AABB collision
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }

  onHit() {
    this.hit = true;
    window.location.href = this.link; // navigate
  }
}
