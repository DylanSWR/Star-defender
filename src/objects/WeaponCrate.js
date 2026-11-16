import Phaser from 'phaser';
import { GAME_HEIGHT, INVENTORY } from '../config.js';

// Caja de arma que cae desde un enemigo o el jefe. Rebota en los bordes laterales y late
// suavemente para llamar la atención. Es parte de un pool (se reutiliza, no se destruye).
// Tipos: 'laser', 'missile' y 'shock' (ver WEAPONS en config.js).
export default class WeaponCrate extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
  }

  spawn(kind, x, y) {
    this.kind = kind;
    this.age = 0;
    this.enableBody(true, x, y, true, true);
    this.setTexture(`crate_${kind}`);
    this.setScale(1);
    this.setCollideWorldBounds(true).setBounce(1, 0);
    this.setVelocity(Phaser.Math.Between(-50, 50), INVENTORY.crateFallSpeed);
    this.setDepth(7);
  }

  update(time, delta) {
    if (!this.active) return;
    this.age += delta;
    this.setScale(1 + 0.08 * Math.sin(this.age * 0.008)); // latido
    if (this.y > GAME_HEIGHT + 30) this.disableBody(true, true); // salió de pantalla
  }
}
