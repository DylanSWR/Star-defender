import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT, COLORS } from '../config.js';
import Button from '../ui/Button.js';
import StorageManager from '../managers/StorageManager.js';
import audio from '../audio/AudioManager.js';
import gameState, { STATES } from '../managers/GameStateManager.js';

// Menú principal: iniciar, continuar (nivel guardado), sonido, instrucciones y controles.
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    gameState.set(STATES.MENU);

    this.stars1 = this.add.tileSprite(W / 2, H / 2, W, H, 'stars1');
    this.stars2 = this.add.tileSprite(W / 2, H / 2, W, H, 'stars2');

    this.add.image(W / 2, 145, 'player').setScale(2);
    this.add.text(W / 2, 246, 'STAR DEFENDER', {
      fontFamily: FONT, fontSize: '26px', color: COLORS.accent, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(W / 2, 294, `RÉCORD: ${StorageManager.highScore}`, {
      fontFamily: FONT, fontSize: '13px', color: COLORS.gold, stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    let y = 358;
    new Button(this, W / 2, y, 'JUGAR', () => this.startGame(1), { width: 280, fontSize: '14px' });

    const savedLevel = StorageManager.maxLevel;
    if (savedLevel > 1) {
      y += 66;
      new Button(this, W / 2, y, `CONTINUAR (OLEADA ${savedLevel})`, () => this.startGame(savedLevel), {
        width: 280, fill: 0x15803d, hoverFill: 0x22c55e, fontSize: '10px'
      });
    }

    y += 66;
    this.muteBtn = new Button(this, W / 2, y, '', () => {
      audio.toggleMute();
      this.refreshMute();
    }, { width: 280, fill: 0x475569, hoverFill: 0x64748b, fontSize: '12px' });
    this.refreshMute();

    // Instrucciones y controles siempre visibles (accesibilidad mínima).
    const info = [
      'OBJETIVO',
      'Sobrevive 5 oleadas y destruye al jefe final.',
      'Power-ups: amarillo=triple, azul=escudo, verde=vida.',
      '',
      'CONTROLES',
      'Flechas o A/D: mover   ESPACIO: disparar',
      'P o ESC: pausa   M: sonido',
      'Móvil: botones en pantalla'
    ].join('\n');
    this.add.text(W / 2, 650, info, {
      fontFamily: FONT, fontSize: '8px', color: '#e2e8f0', stroke: '#000000', strokeThickness: 3,
      align: 'center', lineSpacing: 8, wordWrap: { width: 444 }
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ENTER', () => this.startGame(1));
    this.input.keyboard.on('keydown-M', () => { audio.toggleMute(); this.refreshMute(); });
  }

  refreshMute() {
    this.muteBtn.setLabel(audio.isMuted ? 'SONIDO: OFF' : 'SONIDO: ON');
  }

  startGame(level) {
    this.scene.start('GameScene', { level });
  }

  update(time, delta) {
    this.stars1.tilePositionY -= delta * 0.03;
    this.stars2.tilePositionY -= delta * 0.08;
  }
}
