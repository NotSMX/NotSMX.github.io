import { keys } from '../input.js';
import { JUMP_STRENGTH, FLOOR_Y } from '../constants.js';

export class PlayerJump {
  constructor(player) {
    this.player = player;
  }

  update() {
    const p = this.player;
    if (keys['ArrowUp'] && p.y >= FLOOR_Y) {
      p.vy = JUMP_STRENGTH;
      p.setState('jump');
    }
  }
}
