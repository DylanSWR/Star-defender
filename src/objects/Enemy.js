import Phaser from 'phaser';
import { ENEMY_TYPES, GAME_HEIGHT } from '../config.js';

// Enemigo genérico configurable por tipo (ver ENEMY_TYPES en config.js).
// Patrones de movimiento: 'straight' (recto), 'sine' (zigzag suave) y 'boss'.
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
  }

  /** Activa (reutiliza) el enemigo con las propiedades del tipo indicado. */
  spawn(typeName, x, y, level) {
    const cfg = ENEMY_TYPES[typeName];
    this.cfg = cfg;
    this.enableBody(true, x, y, true, true);
    this.setTexture(cfg.texture);
    this.clearTint();
    this.body.setSize(this.width * 0.8, this.height * 0.8, true);

    // La dificultad crece con el nivel: más vida (no jefe) y más velocidad.
    this.maxHp = cfg.hp + (cfg.boss ? 0 : Math.floor((level - 1) / 2));
    this.hp = this.maxHp;
    this.age = 0;
    this.nextShot = this.scene.time.now + Phaser.Math.Between(600, 1600);
    this.setVelocity(0, cfg.speed * (1 + 0.08 * (level - 1)));
    this.setDepth(5);
  }

  update(time, delta) {
    if (!this.active) return;
    this.age += delta;

    if (this.cfg.move === 'sine') {
      this.setVelocityX(Math.cos(this.age * 0.003) * 140);
    } else if (this.cfg.move === 'boss') {
      // Baja hasta y=140 y luego patrulla de lado a lado.
      this.setVelocityY(this.y < 140 ? 70 : 0);
      this.setVelocityX(Math.cos(this.age * 0.0012) * 150);
    }

    if (this.cfg.fireDelay && this.y > 0 && time > this.nextShot) {
      this.nextShot = time + this.cfg.fireDelay;
      this.scene.enemyShoot(this);
    }

    if (this.y > GAME_HEIGHT + 40) this.disableBody(true, true); // salió de pantalla
  }

  /** Recibe daño. Devuelve true si murió. */
  hit(damage) {
    this.hp -= damage;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => { if (this.active) this.clearTint(); });

    if (this.hp <= 0) {
      const { x, y } = this;
      this.disableBody(true, true);
      this.scene.onEnemyDestroyed(this, x, y);
      return true;
    }
    return false;
  }
}
