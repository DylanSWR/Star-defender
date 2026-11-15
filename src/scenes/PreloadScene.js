import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT } from '../config.js';
import audio from '../audio/AudioManager.js';

// Escena de carga: usa el Loader de Phaser para traer datos (JSON), imágenes y audio reales,
// mostrando una barra de progreso antes de abrir el menú principal.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.add.text(W / 2, H / 2 - 42, 'CARGANDO...', {
      fontFamily: FONT, fontSize: '18px', color: '#ffffff', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    const barBg = this.add.rectangle(W / 2, H / 2, 304, 22, 0x0f172a).setStrokeStyle(3, 0xe2e8f0);
    const bar = this.add.rectangle(W / 2 - 148, H / 2, 296, 14, 0x38bdf8).setOrigin(0, 0.5).setScale(0, 1);

    this.load.on('progress', (p) => bar.setScale(p, 1));
    this.load.on('loaderror', (file) => console.error('No se pudo cargar:', file.src));
    this.load.on('complete', () => barBg.destroy());

    this.load.setPath('assets/');

    // Datos de oleadas
    this.load.json('levels', 'data/levels.json');

    // Imágenes (conservando las claves que usa el resto del proyecto)
    this.load.image('player', 'images/player.png');
    this.load.image('enemy1', 'images/enemy1.png');
    this.load.image('enemy2', 'images/enemy2.png');
    this.load.image('enemy3', 'images/enemy3.png');
    this.load.image('boss', 'images/boss.png');
    this.load.image('bullet', 'images/bullet_player.png');
    this.load.image('enemyBullet', 'images/bullet_enemy.png');
    // Balas del jefe final, una por fase (ver BOSS.bullets en config.js)
    this.load.image('bossBullet1', 'images/boss_bullet_1.png');
    this.load.image('bossBullet2', 'images/boss_bullet_2.png');
    this.load.image('bossBullet3', 'images/boss_bullet_3.png');
    this.load.image('pu_triple', 'images/powerup_triple.png');
    this.load.image('pu_shield', 'images/powerup_shield.png');
    this.load.image('pu_life', 'images/powerup_life.png');
    this.load.image('shield', 'images/shield.png');
    this.load.image('spark', 'images/spark.png');
    this.load.image('stars1', 'images/background.png');
    this.load.image('stars2', 'images/stars_overlay.png');

    // Audio real (música y 7 efectos)
    this.load.audio('music', 'audio/music.ogg');
    this.load.audio('shoot', 'audio/shoot.wav');
    this.load.audio('hit', 'audio/hit.mp3');
    this.load.audio('explosion', 'audio/explosion.wav');
    this.load.audio('powerup', 'audio/powerup.wav');
    this.load.audio('click', 'audio/click.wav');
    this.load.audio('win', 'audio/win.ogg');
    this.load.audio('lose', 'audio/lose.ogg');
  }

  create() {
    audio.init(this.sound);
    const startMenu = () => this.scene.start('MenuScene');
    if (document.fonts && document.fonts.load) {
      document.fonts.load('16px "Press Start 2P"').then(startMenu, startMenu);
    } else {
      startMenu();
    }
  }
}
