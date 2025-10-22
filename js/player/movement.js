import { keys } from '../input.js';
import { ACCEL, MAX_SPEED, FRICTION } from '../constants.js';

export class PlayerMovement {
  constructor(player) {
    this.player = player;
  }

  update() {
    const p = this.player;
    if (keys['ArrowLeft']) this.moveLeft();
    else if (keys['ArrowRight']) this.moveRight();
    else this.stop();
  }

  moveLeft() {
    const p = this.player;
    p.vx -= ACCEL;
    if (p.vx < -MAX_SPEED) p.vx = -MAX_SPEED;

    if (p.direction === 'right' && Math.abs(p.vx) >= MAX_SPEED - 0.5 && p.state !== 'jump') {
      p.setState('rightToLeft');
      p.turning = true;
    } else {
      p.direction = 'left';
      if (!p.turning && p.state !== 'jump') p.setState('move');
    }
  }

  moveRight() {
    const p = this.player;
    p.vx += ACCEL;
    if (p.vx > MAX_SPEED) p.vx = MAX_SPEED;

    if (p.direction === 'left' && Math.abs(p.vx) >= MAX_SPEED - 0.5 && p.state !== 'jump') {
      p.setState('leftToRight');
      p.turning = true;
    } else {
      p.direction = 'right';
      if (!p.turning && p.state !== 'jump') p.setState('move');
    }
  }

  stop() {
    const p = this.player;
    p.vx *= FRICTION;
    if (Math.abs(p.vx) < 0.05) p.vx = 0;
    if (!p.turning && p.state !== 'jump') p.setState('idle');
  }
}
