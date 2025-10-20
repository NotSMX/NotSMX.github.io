import { GRAVITY, FLOOR_Y } from '../constants.js';

export class PlayerPhysics {
  constructor(player) {
    this.player = player;
  }

  update() {
    const p = this.player;
    p.vy += GRAVITY;
    p.y += p.vy;
    p.x += p.vx;

    if (p.y >= FLOOR_Y) {
      p.y = FLOOR_Y;
      p.vy = 0;
      if (p.state === 'jump') {
        p.frameTimer = 0;
        p.setState('idle');
      }
    }
  }
}
