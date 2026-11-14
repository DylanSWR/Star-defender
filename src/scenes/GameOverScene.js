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

    this.add.text(W / 2, 190, won ? '¡VICTORIA!' : 'GAME OVER', {
      fontFamily: FONT, fontSize: '52px', fontStyle: 'bold',
      color: won ? COLORS.ok : COLORS.danger, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(W / 2, 270, `Puntuación: ${score}\nOleada alcanzada: ${level}`, {
      fontFamily: FONT, fontSize: '26px', color: '#ffffff', align: 'center', lineSpacing: 8
    }).setOrigin(0.5);

    this.add.text(W / 2, 340, newRecord ? '¡NUEVO RÉCORD!' : `Récord: ${highScore}`, {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: COLORS.gold
    }).setOrigin(0.5);

    new Button(this, W / 2, 440, 'JUGAR DE NUEVO', () => this.scene.start('GameScene', { level: 1 }), { width: 280 });
    if (!won && level > 1) {
      new Button(this, W / 2, 506, `CONTINUAR (OLEADA ${level})`, () => this.scene.start('GameScene', { level }), { width: 280, fill: 0x15803d, fontSize: '18px' });
    }
    new Button(this, W / 2, won || level <= 1 ? 506 : 572, 'MENÚ PRINCIPAL', () => this.scene.start('MenuScene'), { width: 280, fill: 0x475569 });

    this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene', { level: 1 }));
  }

  update(time, delta) {
    this.stars1.tilePositionY -= delta * 0.03;
  }
}
