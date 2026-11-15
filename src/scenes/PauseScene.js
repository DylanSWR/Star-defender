import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT } from '../config.js';
import Button from '../ui/Button.js';
import audio from '../audio/AudioManager.js';

// Pantalla de pausa: se lanza ENCIMA de GameScene (que queda pausada, no destruida).
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.76);
    this.add.text(W / 2, 195, 'PAUSA', {
      fontFamily: FONT, fontSize: '28px', color: '#ffffff', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    new Button(this, W / 2, 300, 'REANUDAR', () => this.resumeGame(), { width: 270, fontSize: '13px' });
    new Button(this, W / 2, 366, 'REINICIAR', () => this.scene.start('GameScene', { level: 1 }), {
      width: 270, fill: 0x15803d, hoverFill: 0x22c55e, fontSize: '13px'
    });
    new Button(this, W / 2, 432, 'MENÚ PRINCIPAL', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    }, { width: 270, fill: 0x991b1b, hoverFill: 0xdc2626, fontSize: '12px' });
    this.muteBtn = new Button(this, W / 2, 498, '', () => {
      audio.toggleMute();
      this.refreshMute();
    }, { width: 270, fill: 0x475569, hoverFill: 0x64748b, fontSize: '12px' });
    this.refreshMute();

    this.add.text(W / 2, 585, 'Flechas / A D: mover   ESPACIO: disparar\nP o ESC: reanudar   M: sonido', {
      fontFamily: FONT, fontSize: '8px', color: '#e2e8f0', stroke: '#000000', strokeThickness: 3,
      align: 'center', lineSpacing: 10
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-P', () => this.resumeGame());
    this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    this.input.keyboard.on('keydown-M', () => { audio.toggleMute(); this.refreshMute(); });
  }

  refreshMute() {
    this.muteBtn.setLabel(audio.isMuted ? 'SONIDO: OFF' : 'SONIDO: ON');
  }

  resumeGame() {
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
