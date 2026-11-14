import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

// Bala reutilizable (object pooling): en vez de crear y destruir objetos, se activan y
// desactivan. Esto evita tirones por el recolector de basura y mantiene los FPS estables.
export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
  }

  fire(x, y, vx, vy) {
    this.enableBody(true, x, y, true, true);
    this.setVelocity(vx, vy);
    this.setRotation(Math.atan2(vy, vx) + Math.PI / 2);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    const margin = 30;
    if (this.active && (this.y < -margin || this.y > GAME_HEIGHT + margin ||
                        this.x < -margin || this.x > GAME_WIDTH + margin)) {
      this.disableBody(true, true);
    }
  }
}
