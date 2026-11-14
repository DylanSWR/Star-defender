import Phaser from 'phaser';
import {
  GAME_WIDTH as W, GAME_HEIGHT as H, PLAYER, TOTAL_LEVELS,
  POWERUP_KINDS, POWERUP_DROP_CHANCE, COLORS, FONT
} from '../config.js';
import Player from '../objects/Player.js';
import Bullet from '../objects/Bullet.js';
import Enemy from '../objects/Enemy.js';
import PowerUp from '../objects/PowerUp.js';
import HUD from '../ui/HUD.js';
import TouchControls from '../ui/TouchControls.js';
import WaveManager from '../managers/WaveManager.js';
import StorageManager from '../managers/StorageManager.js';
import audio from '../audio/AudioManager.js';
import { registerCollisions } from '../physics/collisions.js';

// Escena principal: crea los objetos, lee los controles y reacciona a las colisiones.
// La lógica específica vive en clases aparte (Player, Enemy, WaveManager, HUD...).
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.startLevel = (data && data.level) || 1;
  }

  create() {
    // Estado de la partida (se reinicia en cada create, así "reiniciar" funciona).
    this.score = 0;
    this.finished = false;
    this.boss = null;
    this.highScore = StorageManager.highScore;

    // Solo los bordes laterales rebotan (los power-ups); arriba y abajo quedan libres.
    this.physics.world.setBoundsCollision(true, true, false, false);

    // Fondo con parallax.
    this.stars1 = this.add.tileSprite(W / 2, H / 2, W, H, 'stars1');
    this.stars2 = this.add.tileSprite(W / 2, H / 2, W, H, 'stars2');

    // Grupos con pooling (los objetos se reutilizan).
    this.playerBullets = this.physics.add.group({ classType: Bullet, defaultKey: 'bullet', maxSize: 60 });
    this.enemyBullets = this.physics.add.group({ classType: Bullet, defaultKey: 'enemyBullet', maxSize: 80 });
    this.enemies = this.physics.add.group({ classType: Enemy, defaultKey: 'enemy1', maxSize: 30, runChildUpdate: true });
    this.powerUps = this.physics.add.group({ classType: PowerUp, defaultKey: 'pu_triple', maxSize: 8, runChildUpdate: true });

    this.player = new Player(this, W / 2, PLAYER.y);

    // Emisor de partículas para explosiones.
    this.explosions = this.add.particles(0, 0, 'spark', {
      speed: { min: 60, max: 240 }, lifespan: 450, scale: { start: 1.3, end: 0 },
      blendMode: 'ADD', emitting: false
    }).setDepth(50);

    this.hud = new HUD(this, {
      highScore: this.highScore,
      onPause: () => this.togglePause(),
      onMute: () => this.toggleMute()
    });
    this.hud.setLives(this.player.lives);

    // Controles: teclado siempre; botones táctiles solo en dispositivos con pantalla táctil.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({ a: 'A', d: 'D', space: 'SPACE' });
    this.touch = this.sys.game.device.input.touch ? new TouchControls(this) : null;
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-M', () => this.toggleMute());

    // Al volver de la pausa se sueltan teclas/botones para evitar "teclas pegadas".
    this.events.on('resume', this.handleResume, this);
    this.events.once('shutdown', () => this.events.off('resume', this.handleResume, this));

    registerCollisions(this);

    this.waves = new WaveManager(this);
    this.waves.startLevel(this.startLevel);
  }

  update(time, delta) {
    this.stars1.tilePositionY -= delta * 0.03;
    this.stars2.tilePositionY -= delta * 0.08;
    if (this.finished) return;

    const controls = this.readControls();
    this.player.update(time, controls);
    if (controls.fire) this.player.shoot(time);

    this.waves.update(time);

    if (this.boss && this.boss.active) this.hud.setBossRatio(this.boss.hp / this.boss.maxHp);
  }

  readControls() {
    const t = this.touch ? this.touch.state : {};
    return {
      left: !!(this.cursors.left.isDown || this.keys.a.isDown || t.left),
      right: !!(this.cursors.right.isDown || this.keys.d.isDown || t.right),
      fire: !!(this.keys.space.isDown || this.cursors.up.isDown || t.fire)
    };
  }

  // ---------- Pausa y sonido ----------
  togglePause() {
    if (this.finished) return;
    this.scene.launch('PauseScene');
    this.scene.pause();
  }

  handleResume() {
    this.input.keyboard.resetKeys();
    if (this.touch) this.touch.reset();
    this.hud.refreshMute();
  }

  toggleMute() {
    audio.toggleMute();
    this.hud.refreshMute();
  }

  // ---------- Oleadas ----------
  onLevelStart(level) {
    this.hud.setLevel(level);
    this.showBanner(level === TOTAL_LEVELS ? '¡JEFE FINAL!' : `OLEADA ${level}`);
  }

  onLevelCleared(level) {
    if (this.finished) return;
    if (level >= TOTAL_LEVELS) { this.endGame(true); return; }
    this.addScore(100 * level); // bonus por superar la oleada
    this.showBanner('¡OLEADA SUPERADA!');
    this.time.delayedCall(1800, () => {
      if (!this.finished) this.waves.startLevel(level + 1);
    });
  }

  onBossSpawn(boss) {
    this.boss = boss;
    this.hud.showBoss();
  }

  showBanner(text) {
    const banner = this.add.text(W / 2, H / 2 - 80, text, {
      fontFamily: FONT, fontSize: '38px', fontStyle: 'bold', color: COLORS.gold, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(95).setAlpha(0);
    this.tweens.add({
      targets: banner, alpha: 1, duration: 300, hold: 1000, yoyo: true,
      onComplete: () => banner.destroy()
    });
  }

  // ---------- Disparos enemigos ----------
  enemyShoot(enemy) {
    const x = enemy.x;
    const y = enemy.y + enemy.height * 0.4;
    if (enemy.cfg.boss) {
      // El jefe dispara un abanico de 5 balas.
      [-40, -20, 0, 20, 40].forEach((deg) => {
        const rad = Phaser.Math.DegToRad(deg);
        this.fireEnemyBullet(x, y, Math.sin(rad) * 210, Math.cos(rad) * 210);
      });
    } else {
      // Los demás apuntan hacia el jugador.
      const angle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
      this.fireEnemyBullet(x, y, Math.cos(angle) * 220, Math.sin(angle) * 220);
    }
  }

  fireEnemyBullet(x, y, vx, vy) {
    const bullet = this.enemyBullets.get(x, y);
    if (bullet) bullet.fire(x, y, vx, vy);
  }

  // ---------- Colisiones (llamadas desde physics/collisions.js) ----------
  onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.disableBody(true, true);
    const died = enemy.hit(1);
    if (!died) audio.play('hit');
  }

  onPlayerHitEnemy(player, enemy) {
    if (!enemy.active) return;
    if (!enemy.cfg.boss) enemy.hit(99); // chocar destruye al enemigo normal
    this.damagePlayer();
  }

  onPlayerHitBullet(player, bullet) {
    if (!bullet.active) return;
    bullet.disableBody(true, true);
    this.damagePlayer();
  }

  onCollectPowerUp(player, powerUp) {
    if (!powerUp.active) return;
    const kind = powerUp.kind;
    powerUp.disableBody(true, true);
    if (kind === 'triple') player.activateTriple(this.time.now);
    if (kind === 'shield') player.activateShield();
    if (kind === 'life') { player.addLife(); this.hud.setLives(player.lives); }
    this.addScore(50);
    audio.play('powerup');
  }

  // ---------- Reglas del juego ----------
  onEnemyDestroyed(enemy, x, y) {
    this.addScore(enemy.cfg.score);
    this.explode(x, y, enemy.cfg.boss ? 70 : 14);
    audio.play('explosion');

    if (enemy.cfg.boss) {
      this.hud.hideBoss();
      this.endGame(true); // condición de victoria: derrotar al jefe
    } else if (Math.random() < POWERUP_DROP_CHANCE) {
      const powerUp = this.powerUps.get(x, y);
      if (powerUp) powerUp.spawn(Phaser.Utils.Array.GetRandom(POWERUP_KINDS), x, y);
    }
  }

  damagePlayer() {
    if (this.finished) return;
    if (!this.player.takeHit(this.time.now)) return;

    audio.play('hit');
    this.cameras.main.shake(180, 0.01);
    this.hud.setLives(this.player.lives);
    if (this.player.lives <= 0) {
      this.explode(this.player.x, this.player.y, 40);
      audio.play('explosion');
      this.player.die();
      this.endGame(false); // condición de derrota: sin vidas
    }
  }

  addScore(points) {
    this.score += points;
    this.hud.setScore(this.score);
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.hud.setHigh(this.highScore);
    }
  }

  explode(x, y, count) {
    this.explosions.emitParticleAt(x, y, count);
  }

  clearHostiles() {
    this.enemies.getChildren().forEach((e) => { if (e.active) e.disableBody(true, true); });
    this.enemyBullets.getChildren().forEach((b) => { if (b.active) b.disableBody(true, true); });
  }

  endGame(won) {
    if (this.finished) return;
    this.finished = true;
    this.player.setVelocity(0, 0);
    this.clearHostiles();
    audio.play(won ? 'win' : 'lose');

    // Persistencia: récord y progreso.
    const newRecord = StorageManager.submitScore(this.score);
    if (won) StorageManager.resetProgress();

    this.time.delayedCall(1400, () => {
      this.scene.start('GameOverScene', {
        won, score: this.score, level: this.waves.level,
        newRecord, highScore: StorageManager.highScore
      });
    });
  }
}
