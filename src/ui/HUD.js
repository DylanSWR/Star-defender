import { GAME_WIDTH as W, PLAYER, FONT, COLORS, BOSS } from '../config.js';
import Button from './Button.js';
import audio from '../audio/AudioManager.js';
import InventoryHUD from './InventoryHUD.js';

// HUD: puntaje, récord, vidas, oleada, barra del jefe y botones de pausa / sonido.
export default class HUD {
  constructor(scene, { highScore, onPause, onMute, onSlot, inventoryX }) {
    const style = (size, color) => ({ fontFamily: FONT, fontSize: size, color, stroke: '#000000', strokeThickness: 4 });

    this.scoreText = scene.add.text(14, 12, 'PUNTOS 0', style('11px', COLORS.text)).setDepth(100);
    this.highText = scene.add.text(W - 14, 12, `RÉCORD ${highScore}`, style('11px', COLORS.gold)).setOrigin(1, 0).setDepth(100);
    this.levelText = scene.add.text(W / 2, 52, 'OLEADA 1', style('10px', COLORS.accent)).setOrigin(0.5, 0.5).setDepth(100);

    // Iconos de vidas.
    this.lifeIcons = [];
    for (let i = 0; i < PLAYER.maxLives; i++) {
      this.lifeIcons.push(scene.add.image(26 + i * 26, 52, 'player').setScale(0.5).setDepth(100));
    }

    this.pauseBtn = new Button(scene, W - 30, 52, 'II', onPause, { width: 42, height: 30, fontSize: '10px' }).setDepth(100);
    this.muteBtn = new Button(scene, W - 114, 52, '', onMute, {
      width: 112, height: 30, fill: 0x334155, hoverFill: 0x475569, fontSize: '8px'
    }).setDepth(100);
    this.refreshMute();

    // Barra de vida del jefe con borde retro pixelado (oculta hasta que aparece).
    this.bossBg = scene.add.rectangle(W / 2, 84, 306, 16, 0x020617, 0.9).setStrokeStyle(3, 0xe2e8f0).setDepth(100).setVisible(false);
    this.bossFill = scene.add.rectangle(W / 2 - 148, 84, 296, 10, BOSS.colors[1]).setOrigin(0, 0.5).setDepth(101).setVisible(false);
    this.bossLabel = scene.add.text(W / 2, 104, '', style('8px', COLORS.text)).setOrigin(0.5).setDepth(101).setVisible(false);

    // Inventario de armas (parte inferior de la pantalla).
    this.inventory = new InventoryHUD(scene, { centerX: inventoryX ?? W / 2, onSlot });
  }

  setScore(v) { this.scoreText.setText(`PUNTOS ${v}`); }
  setHigh(v) { this.highText.setText(`RÉCORD ${v}`); }
  setLevel(v) { this.levelText.setText(`OLEADA ${v}`); }
  setLives(n) { this.lifeIcons.forEach((icon, i) => icon.setVisible(i < n)); }
  refreshMute() { this.muteBtn.setLabel(audio.isMuted ? 'SONIDO: OFF' : 'SONIDO: ON'); }

  showBoss() {
    this.bossBg.setVisible(true);
    this.bossFill.setVisible(true).setScale(1, 1);
    this.bossLabel.setVisible(true);
    this.setBossPhase(1);
  }
  setBossRatio(r) { this.bossFill.setScale(Math.max(0, r), 1); }
  /** Cambia el color de la barra y el texto según la fase del jefe. */
  setBossPhase(phase) {
    this.bossFill.setFillStyle(BOSS.colors[phase]);
    this.bossLabel.setText(`${BOSS.name}  FASE ${phase}`);
  }
  /** Inventario: contenido de los espacios y arma temporal activa. */
  setInventory(slots, active) { this.inventory.refresh(slots, active); }
  /** Barra de tiempo del arma activa (1 = completa, 0 = agotada). */
  setWeaponTime(ratio) { this.inventory.setTime(ratio); }
  hideBoss() { this.bossBg.setVisible(false); this.bossFill.setVisible(false); this.bossLabel.setVisible(false); }
}
