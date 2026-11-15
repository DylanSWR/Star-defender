import Phaser from 'phaser';
import Enemy from './Enemy.js';
import { GAME_WIDTH as W, BOSS } from '../config.js';

// Jefe final con 3 fases. La fase depende de la vida que le queda:
//   Fase 1 (100% a 60%): abanico de 5 balas.
//   Fase 2 (60% a 30%):  ráfagas dirigidas al jugador y 2 escoltas cada 5 s.
//   Fase 3 (menos de 30%): modo furia: se mueve más rápido, dispara en espiral y lanza abanicos dirigidos.
// Al cambiar de fase avisa a la escena (scene.onBossPhase) para el banner, el sonido y la recompensa.
// Hereda de Enemy: reutiliza spawn() y hit() (vida, parpadeo al recibir daño y muerte).

const SPEED_SWAY = { 1: 0.0012, 2: 0.0016, 3: 0.0024 }; // velocidad del vaivén lateral por fase
const SWAY_RANGE = 140;                                  // cuántos px se mueve a cada lado del centro

export default class Boss extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss');
  }

  /** Activa el jefe. Mantiene la misma firma que Enemy.spawn para que WaveManager lo trate igual. */
  spawn(typeName, x, y, level) {
    super.spawn('boss', x, y, level);
    this.waveLevel = level;
    this.phase = 1;
    this.arrived = false;   // true cuando termina de entrar a pantalla
    this.sway = 0;          // ángulo acumulado del vaivén (acumularlo evita saltos al cambiar de fase)
    this.spiralAngle = 0;   // ángulo del disparo en espiral (fase 3)
    this.nextShot = 0;
    this.nextFan = 0;
    this.nextEscort = 0;
  }

  update(time, delta) {
    if (!this.active) return;
    this.age += delta;

    // Entrada: baja hasta su posición y recién entonces empieza a atacar.
    if (!this.arrived) {
      this.setVelocity(0, 70);
      if (this.y >= BOSS.hoverY) {
        this.arrived = true;
        this.setVelocityY(0);
        this.nextShot = time + 800;
        this.nextFan = time + 1500;
        this.nextEscort = time + 4000;
      }
      return;
    }

    this.updatePhase();
    this.move(delta);
    this.attack(time);
  }

  // ---------- Fases ----------
  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const next = ratio > BOSS.phase2At ? 1 : ratio > BOSS.phase3At ? 2 : 3;
    if (next > this.phase) {
      this.phase = next;
      this.onPhaseChange();
    }
  }

  onPhaseChange() {
    const now = this.scene.time.now;
    this.nextShot = now + 900; // pausa corta para que el jugador reaccione
    if (this.phase === 2) this.nextEscort = now + 1500;
    if (this.phase === 3) this.nextFan = now + 1200;

    // Destello blanco; en la fase 3 queda un tinte rojizo permanente.
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(120, () => {
      if (!this.active) return;
      if (this.phase === 3) this.setTint(BOSS.furyTint);
      else this.clearTint();
    });

    this.scene.onBossPhase(this, this.phase);
  }

  // ---------- Movimiento ----------
  // Sigue suavemente un punto que oscila alrededor del centro. Así nunca se sale de pantalla.
  move(delta) {
    this.sway += delta * SPEED_SWAY[this.phase];
    const targetX = W / 2 + SWAY_RANGE * Math.sin(this.sway);
    this.setVelocityX(Phaser.Math.Clamp((targetX - this.x) * 6, -320, 320));
  }

  // ---------- Ataques ----------
  attack(time) {
    if (this.phase === 1) {
      if (time > this.nextShot) {
        this.nextShot = time + 1100;
        this.fan([-40, -20, 0, 20, 40], 210);
      }
    } else if (this.phase === 2) {
      if (time > this.nextShot) {
        this.nextShot = time + 850;
        this.aimed([-14, 0, 14], 250);
      }
      if (time > this.nextEscort) {
        this.nextEscort = time + 5000;
        this.callEscorts(2);
      }
    } else {
      if (time > this.nextShot) {
        this.nextShot = time + 130;
        this.spiralAngle = (this.spiralAngle + 19) % 360;
        this.shoot(this.spiralAngle, 200);
      }
      if (time > this.nextFan) {
        this.nextFan = time + 1800;
        this.aimed([-24, -12, 0, 12, 24], 240);
      }
    }
  }

  /** Una bala. El ángulo se mide desde "recto hacia abajo" (0 = abajo, 90 = derecha). */
  shoot(angleDeg, speed) {
    const rad = Phaser.Math.DegToRad(angleDeg);
    const y = this.y + this.displayHeight * 0.4;
    this.scene.fireEnemyBullet(this.x, y, Math.sin(rad) * speed, Math.cos(rad) * speed, BOSS.bullets[this.phase]);
  }

  /** Varias balas en abanico con los ángulos indicados. */
  fan(angles, speed) {
    angles.forEach((a) => this.shoot(a, speed));
  }

  /** Abanico centrado en la posición actual del jugador. */
  aimed(offsets, speed) {
    const p = this.scene.player;
    const base = Phaser.Math.RadToDeg(Math.atan2(p.x - this.x, p.y - this.y));
    offsets.forEach((o) => this.shoot(base + o, speed));
  }

  /** Suelta enemigos pequeños a los lados del jefe. */
  callEscorts(count) {
    for (let i = 0; i < count; i++) {
      const escort = this.scene.enemies.get(0, 0);
      if (!escort) return; // pool lleno: se omite esta escolta
      escort.spawn('grunt', this.x + (i === 0 ? -70 : 70), this.y + 60, this.waveLevel);
    }
  }

  // ---------- Daño ----------
  hit(damage) {
    const died = super.hit(damage);
    if (died) {
      // El jefe es una instancia única: se elimina para que el pool no la reutilice como enemigo normal.
      this.scene.time.delayedCall(50, () => this.destroy());
    } else if (this.phase === 3) {
      // Enemy.hit quita el tinte tras el destello; en furia se lo volvemos a poner.
      this.scene.time.delayedCall(70, () => { if (this.active) this.setTint(BOSS.furyTint); });
    }
    return died;
  }
}
