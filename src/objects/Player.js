import Phaser from 'phaser';
import { PLAYER } from '../config.js';
import audio from '../audio/AudioManager.js';

// Nave del jugador: movimiento horizontal, disparo, vidas, escudo y disparo triple.
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true).setDepth(10);
    this.body.setSize(26, 34);

    this.lives = PLAYER.lives;
    this.nextShot = 0;
    this.tripleUntil = 0;
    this.invulnerableUntil = 0;
    this.hasShield = false;
    this.shieldFx = scene.add.image(x, y, 'shield').setDepth(11).setVisible(false);
  }

  /** Se llama una vez por frame desde GameScene.update(). */
  update(time, controls) {
    const dir = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    this.setVelocityX(dir * PLAYER.speed);
    this.setAngle(dir * 8); // pequeño giro visual al moverse
    this.shieldFx.setPosition(this.x, this.y).setVisible(this.hasShield && this.active);
  }

  /** Dispara respetando la cadencia. Con power-up lanza 3 balas en abanico. */
  shoot(time) {
    // Un arma temporal del inventario (láser o misiles) reemplaza el disparo normal.
    if (this.scene.inventory && this.scene.inventory.fireSpecial()) return;

    if (time < this.nextShot) return;
    this.nextShot = time + PLAYER.fireDelay;

    const angles = time < this.tripleUntil ? [-14, 0, 14] : [0];
    angles.forEach((deg) => {
      const rad = Phaser.Math.DegToRad(deg);
      const bx = this.x + Math.sign(deg) * 10;
      const by = this.y - 26;
      const bullet = this.scene.playerBullets.get(bx, by);
      if (bullet) bullet.fire(bx, by, Math.sin(rad) * 600, -Math.cos(rad) * 600);
    });
    audio.play('shoot');
  }

  /** Devuelve true si el golpe se procesó (false si estaba invulnerable). */
  takeHit(time) {
    if (time < this.invulnerableUntil) return false;

    if (this.hasShield) {
      this.hasShield = false;          // el escudo absorbe un golpe
      this.invulnerableUntil = time + 600;
      return true;
    }

    this.lives -= 1;
    this.invulnerableUntil = time + PLAYER.invulnMs;
    // Parpadeo mientras dura la invulnerabilidad.
    this.scene.tweens.add({
      targets: this, alpha: 0.3, duration: 100, yoyo: true, repeat: 7,
      onComplete: () => this.setAlpha(1)
    });
    return true;
  }

  activateTriple(time) { this.tripleUntil = time + PLAYER.tripleMs; }
  activateShield() { this.hasShield = true; }
  addLife() { this.lives = Math.min(PLAYER.maxLives, this.lives + 1); }

  die() {
    this.disableBody(true, true);
    this.shieldFx.setVisible(false);
  }
}
