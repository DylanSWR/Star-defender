import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT } from '../config.js';
import { generateTextures } from '../assets/TextureFactory.js';

// Escena de carga: usa el Loader de Phaser para traer los datos de los niveles (JSON),
// muestra una barra de progreso y genera los sprites antes de abrir el menú.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.add.text(W / 2, H / 2 - 40, 'CARGANDO...', { fontFamily: FONT, fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
    const barBg = this.add.rectangle(W / 2, H / 2, 300, 20, 0x1e293b).setStrokeStyle(2, 0xffffff);
    const bar = this.add.rectangle(W / 2 - 148, H / 2, 296, 14, 0x38bdf8).setOrigin(0, 0.5).setScale(0, 1);

    this.load.on('progress', (p) => bar.setScale(p, 1));
    this.load.on('loaderror', (file) => console.error('No se pudo cargar:', file.src));
    this.load.on('complete', () => barBg.destroy());

    this.load.setPath('assets/');
    this.load.json('levels', 'data/levels.json');
  }

  create() {
    generateTextures(this);
    this.scene.start('MenuScene');
  }
}
