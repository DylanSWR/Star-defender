import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

// Bala reutilizable (object pooling): en vez de crear y destruir objetos, se activan y
// desactivan. Esto evita tirones por el recolector de basura y mantiene los FPS estables.
export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.baseKey = key; // imagen por defecto del grupo (bala del jugador o bala enemiga normal)
  }

  /**
   * Dispara la bala. "style" es opcional: { texture, scale } permite cambiar la imagen y el tamaño
   * (el jefe lo usa para tener una bala distinta en cada fase). Sin style vuelve a la imagen base,
   * así una bala reutilizada del pool nunca "hereda" el aspecto del disparo anterior.
   */
  fire(x, y, vx, vy, style = {}) {
    this.enableBody(true, x, y, true, true);

    const key = style.texture || this.baseKey;
    if (this.texture.key !== key) {
      this.setTexture(key);
      this.body.setSize(this.width, this.height); // el área de colisión sigue a la nueva imagen
    }
    this.setScale(style.scale || 1);

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
