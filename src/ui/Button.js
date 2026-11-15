import Phaser from 'phaser';
import { FONT } from '../config.js';
import audio from '../audio/AudioManager.js';

// Botón reutilizable con estética retro arcade pixel-art (borde escalonado, bisel 16-bit y sombra).
export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, opts = {}) {
    super(scene, x, y);
    this.w = opts.width || 240;
    this.h = opts.height || 52;
    this.baseFill = opts.fill !== undefined ? opts.fill : 0x0369a1;
    this.hoverFill = opts.hoverFill !== undefined ? opts.hoverFill : 0x0ea5e9;

    // Sombra fija inferior estilo pixel-art
    this.shadow = scene.add.graphics();
    this._drawPixelBox(this.shadow, 0, 4, this.w, this.h, 0x020617, null, false);

    // Cuerpo del botón con bisel retro
    this.bg = scene.add.graphics();
    this._renderState(this.baseFill, 0xe2e8f0);

    this.label = scene.add.text(0, 0, label, {
      fontFamily: FONT,
      fontSize: opts.fontSize || '13px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      padding: { top: 2, bottom: 2 }
    }).setOrigin(0.5);

    this.add([this.shadow, this.bg, this.label]);

    this.setSize(this.w, this.h);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerover', () => {
      this._renderState(this.hoverFill, 0xfde047);
    });

    this.on('pointerout', () => {
      this.bg.y = 0;
      this.label.y = 0;
      this._renderState(this.baseFill, 0xe2e8f0);
    });

    this.on('pointerdown', () => {
      this.bg.y = 2;
      this.label.y = 2;
      audio.unlock();
      audio.play('click');
      onClick();
    });

    this.on('pointerup', () => {
      this.bg.y = 0;
      this.label.y = 0;
    });

    scene.add.existing(this);
  }

  _renderState(fillColor, borderColor) {
    this.bg.clear();
    this._drawPixelBox(this.bg, 0, 0, this.w, this.h, fillColor, borderColor, true);
  }

  _drawPixelBox(g, cx, cy, w, h, fill, border, withBevel) {
    const x = Math.round(cx - w / 2);
    const y = Math.round(cy - h / 2);
    const cut = 4; // Esquinas escalonadas tipo pixel-art

    // Relleno principal con esquinas recortadas
    g.fillStyle(fill, 1);
    g.fillRect(x + cut, y, w - cut * 2, h);
    g.fillRect(x, y + cut, w, h - cut * 2);

    if (withBevel) {
      // Brillo superior 16-bit
      g.fillStyle(0xffffff, 0.25);
      g.fillRect(x + cut, y + 3, w - cut * 2, 3);
      // Sombra interna inferior 16-bit
      g.fillStyle(0x000000, 0.35);
      g.fillRect(x + cut, y + h - 6, w - cut * 2, 3);
    }

    if (border !== null) {
      const b = 3;
      g.fillStyle(border, 1);
      // Bordes horizontales y verticales
      g.fillRect(x + cut, y, w - cut * 2, b);
      g.fillRect(x + cut, y + h - b, w - cut * 2, b);
      g.fillRect(x, y + cut, b, h - cut * 2);
      g.fillRect(x + w - b, y + cut, b, h - cut * 2);
      // Píxeles diagonales de las 4 esquinas
      g.fillRect(x + b, y + b, b, b);
      g.fillRect(x + w - b * 2, y + b, b, b);
      g.fillRect(x + b, y + h - b * 2, b, b);
      g.fillRect(x + w - b * 2, y + h - b * 2, b, b);
    }
  }

  setLabel(text) { this.label.setText(text); }
}
