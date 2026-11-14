import Phaser from 'phaser';
import { GAME_HEIGHT } from '../config.js';

// Power-up que cae desde un enemigo destruido. Rebota en los bordes laterales (físicas).
// Tipos: 'triple' (disparo triple), 'shield' (escudo), 'life' (vida extra).
export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
  }

  spawn(kind, x, y) {
    this.kind = kind;
    this.enableBody(true, x, y, true, true);
    this.setTexture(`pu_${kind}`);
    this.setCollideWorldBounds(true).setBounce(1, 0);
    this.setVelocity(Phaser.Math.Between(-60, 60), 110);
    this.setDepth(6);
  }

  update() {
    if (this.active && this.y > GAME_HEIGHT + 30) this.disableBody(true, true);
  }
}
