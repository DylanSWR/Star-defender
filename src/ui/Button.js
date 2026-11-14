import Phaser from 'phaser';
import { FONT } from '../config.js';
import audio from '../audio/AudioManager.js';

// Botón reutilizable de interfaz: rectángulo + texto, con efecto hover y sonido de clic.
export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, opts = {}) {
    super(scene, x, y);
    const w = opts.width || 240;
    const h = opts.height || 52;
    const fill = opts.fill !== undefined ? opts.fill : 0x0369a1;

    this.bg = scene.add.rectangle(0, 0, w, h, fill).setStrokeStyle(3, 0xffffff);
    this.label = scene.add.text(0, 0, label, {
      fontFamily: FONT, fontSize: opts.fontSize || '22px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);
    this.add([this.bg, this.label]);

    this.setSize(w, h);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerover', () => this.bg.setFillStyle(0x0ea5e9));
    this.on('pointerout', () => this.bg.setFillStyle(fill));
    this.on('pointerdown', () => {
      audio.unlock();
      audio.play('click');
      onClick();
    });

    scene.add.existing(this);
  }

  setLabel(text) { this.label.setText(text); }
}
