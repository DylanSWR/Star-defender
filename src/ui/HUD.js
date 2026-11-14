import { GAME_WIDTH as W, PLAYER, FONT, COLORS } from '../config.js';
import Button from './Button.js';
import audio from '../audio/AudioManager.js';

// HUD: puntaje, récord, vidas, oleada, barra del jefe y botones de pausa / sonido.
export default class HUD {
  constructor(scene, { highScore, onPause, onMute }) {
    const style = (size, color) => ({ fontFamily: FONT, fontSize: size, fontStyle: 'bold', color, stroke: '#000000', strokeThickness: 3 });

    this.scoreText = scene.add.text(14, 10, 'PUNTOS 0', style('20px', COLORS.text)).setDepth(100);
    this.highText = scene.add.text(W - 14, 10, `RÉCORD ${highScore}`, style('20px', COLORS.gold)).setOrigin(1, 0).setDepth(100);
    this.levelText = scene.add.text(W / 2, 52, 'OLEADA 1', style('18px', COLORS.accent)).setOrigin(0.5, 0.5).setDepth(100);

    // Iconos de vidas.
    this.lifeIcons = [];
    for (let i = 0; i < PLAYER.maxLives; i++) {
      this.lifeIcons.push(scene.add.image(26 + i * 26, 52, 'player').setScale(0.5).setDepth(100));
    }

    this.pauseBtn = new Button(scene, W - 34, 52, 'II', onPause, { width: 44, height: 30, fontSize: '18px' }).setDepth(100);
    this.muteBtn = new Button(scene, W - 118, 52, '', onMute, { width: 100, height: 30, fontSize: '14px' }).setDepth(100);
    this.refreshMute();

    // Barra de vida del jefe (oculta hasta que aparece).
    this.bossBg = scene.add.rectangle(W / 2, 84, 304, 14, 0x000000, 0.7).setStrokeStyle(2, 0xffffff).setDepth(100).setVisible(false);
    this.bossFill = scene.add.rectangle(W / 2 - 150, 84, 300, 10, 0xef4444).setOrigin(0, 0.5).setDepth(101).setVisible(false);
  }

  setScore(v) { this.scoreText.setText(`PUNTOS ${v}`); }
  setHigh(v) { this.highText.setText(`RÉCORD ${v}`); }
  setLevel(v) { this.levelText.setText(`OLEADA ${v}`); }
  setLives(n) { this.lifeIcons.forEach((icon, i) => icon.setVisible(i < n)); }
  refreshMute() { this.muteBtn.setLabel(audio.isMuted ? 'SONIDO: OFF' : 'SONIDO: ON'); }

  showBoss() { this.bossBg.setVisible(true); this.bossFill.setVisible(true).setScale(1, 1); }
  setBossRatio(r) { this.bossFill.setScale(Math.max(0, r), 1); }
  hideBoss() { this.bossBg.setVisible(false); this.bossFill.setVisible(false); }
}
