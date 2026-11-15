import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, FONT, COLORS } from '../config.js';
import Button from '../ui/Button.js';

// Pantalla final: sirve tanto para victoria como para derrota (data.won).
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.result = {
      won: !!data.won, score: data.score || 0, level: data.level || 1,
      newRecord: !!data.newRecord, highScore: data.highScore || 0
    };
  }

  create() {
    const { won, score, level, newRecord, highScore } = this.result;

    this.stars1 = this.add.tileSprite(W / 2, H / 2, W, H, 'stars1');
    this.add.rectangle(W / 2, H / 2, W, H, 0x020617, 0.6);

    this.add.text(W / 2, 185, won ? '¡VICTORIA!' : 'GAME OVER', {
      fontFamily: FONT, fontSize: '28px',
      color: won ? COLORS.ok : COLORS.danger, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(W / 2, 270, `PUNTUACIÓN: ${score}\nOLEADA ALCANZADA: ${level}`, {
      fontFamily: FONT, fontSize: '13px', color: '#ffffff', stroke: '#000000', strokeThickness: 4,
      align: 'center', lineSpacing: 12
    }).setOrigin(0.5);

    this.add.text(W / 2, 348, newRecord ? '¡NUEVO RÉCORD!' : `RÉCORD: ${highScore}`, {
      fontFamily: FONT, fontSize: '15px', color: COLORS.gold, stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    new Button(this, W / 2, 440, 'JUGAR DE NUEVO', () => this.scene.start('GameScene', { level: 1 }), { width: 290, fontSize: '12px' });
    if (!won && level > 1) {
      new Button(this, W / 2, 506, `CONTINUAR (OLEADA ${level})`, () => this.scene.start('GameScene', { level }), {
        width: 290, fill: 0x15803d, hoverFill: 0x22c55e, fontSize: '10px'
      });
    }
    new Button(this, W / 2, won || level <= 1 ? 506 : 572, 'MENÚ PRINCIPAL', () => this.scene.start('MenuScene'), {
      width: 290, fill: 0x475569, hoverFill: 0x64748b, fontSize: '12px'
    });

    this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene', { level: 1 }));
  }

  update(time, delta) {
    this.stars1.tilePositionY -= delta * 0.03;
  }
}
