import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, WEAPONS } from '../config.js';

// Misil teledirigido del jugador (pool). Busca al enemigo más cercano que esté en pantalla
// y gira hacia él con un giro limitado, así dibuja una curva en vez de un giro instantáneo.
// "heading" es el ángulo de vuelo en radianes: 0 = derecha, -PI/2 = arriba.
export default class Missile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
  }

  launch(x, y, heading) {
    this.enableBody(true, x, y, true, true);
    this.setDepth(9);
    this.heading = heading;
    this.target = null;
    this.life = WEAPONS.missile.lifeMs;
    this.applyHeading();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.active) return;

    this.life -= delta;
    const margin = 30;
    if (this.life <= 0 || this.y < -margin || this.y > GAME_HEIGHT + margin ||
        this.x < -margin || this.x > GAME_WIDTH + margin) {
      this.disableBody(true, true);
      return;
    }

    if (!this.target || !this.target.active || this.target.y < 0) this.target = this.findTarget();
    if (this.target) {
      const desired = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
      this.heading = Phaser.Math.Angle.RotateTo(this.heading, desired, WEAPONS.missile.turnRate * delta / 1000);
    }
    this.applyHeading();
  }

  applyHeading() {
    const speed = WEAPONS.missile.speed;
    this.setVelocity(Math.cos(this.heading) * speed, Math.sin(this.heading) * speed);
    this.setRotation(this.heading + Math.PI / 2); // el sprite apunta hacia arriba
  }

  /** Enemigo activo más cercano que ya entró a la pantalla (null si no hay). */
  findTarget() {
    let best = null;
    let bestDist = Infinity;
    this.scene.enemies.getChildren().forEach((e) => {
      if (!e.active || e.y < 0 || e.y > GAME_HEIGHT) return;
      const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
      if (d < bestDist) { bestDist = d; best = e; }
    });
    return best;
  }
}
