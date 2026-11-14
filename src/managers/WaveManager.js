import Phaser from 'phaser';
import { GAME_WIDTH } from '../config.js';
import StorageManager from './StorageManager.js';

// Controla las oleadas. Los datos de cada nivel (cantidad, ritmo, tipos de enemigo, jefe)
// vienen de public/assets/data/levels.json, cargado por el Loader en PreloadScene.
export default class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.levels = scene.cache.json.get('levels');
    this.level = 1;
    this.state = 'idle'; // idle -> spawning -> clearing -> done
    this.queue = [];
    this.nextSpawn = 0;
    this.cfg = null;
  }

  startLevel(level) {
    this.level = level;
    this.cfg = this.levels.find((l) => l.level === level) || this.levels[this.levels.length - 1];

    this.queue = [];
    if (this.cfg.boss) this.queue.push('boss');
    for (let i = 0; i < this.cfg.count; i++) {
      this.queue.push(Phaser.Utils.Array.GetRandom(this.cfg.types));
    }

    this.nextSpawn = this.scene.time.now + 1500; // pausa inicial para mostrar el banner
    this.state = 'spawning';
    StorageManager.saveLevel(level); // persistencia: nivel alcanzado
    this.scene.onLevelStart(level);
  }

  update(time) {
    if (this.state === 'spawning') {
      if (this.queue.length && time >= this.nextSpawn) {
        this.spawn(this.queue.shift());
        this.nextSpawn = time + this.cfg.delay;
      }
      if (!this.queue.length) this.state = 'clearing';
    } else if (this.state === 'clearing' && this.scene.enemies.countActive(true) === 0) {
      this.state = 'done';
      this.scene.onLevelCleared(this.level);
    }
  }

  spawn(type) {
    const enemy = this.scene.enemies.get(0, 0);
    if (!enemy) { this.queue.unshift(type); return; } // pool lleno: reintentar luego

    const isBoss = type === 'boss';
    const x = isBoss ? GAME_WIDTH / 2 : Phaser.Math.Between(40, GAME_WIDTH - 40);
    const y = isBoss ? -70 : -30;
    enemy.spawn(type, x, y, this.level);
    if (isBoss) this.scene.onBossSpawn(enemy);
  }
}
