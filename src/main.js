import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import audio from './audio/AudioManager.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#050816',
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  // FIT escala el juego a cualquier pantalla (escritorio, tablet, móvil) manteniendo la proporción.
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 3 }, // multitáctil: mover + disparar a la vez
  fps: { target: 60 },
  scene: [PreloadScene, MenuScene, GameScene, PauseScene, GameOverScene]
};

new Phaser.Game(config);

// Los navegadores solo permiten audio después de un gesto del usuario.
const unlockAudio = () => audio.unlock();
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);
