import { GAME_WIDTH as W, FONT } from '../config.js';

// Controles táctiles equivalentes al teclado: izquierda, derecha y disparo.
// Guarda su estado en this.state; GameScene lo lee cada frame junto con el teclado.
export default class TouchControls {
  constructor(scene) {
    this.state = { left: false, right: false, fire: false };
    this.buttons = [
      this.createButton(scene, 62, 735, 38, '<', 'left'),
      this.createButton(scene, 162, 735, 38, '>', 'right'),
      this.createButton(scene, W - 72, 735, 48, 'FUEGO', 'fire')
    ];
  }

  createButton(scene, x, y, radius, label, key) {
    const size = radius * 2;
    const box = scene.add.rectangle(x, y, size, size, 0x0f172a, 0.55)
      .setStrokeStyle(3, 0x38bdf8, 0.85).setDepth(90).setInteractive();
    scene.add.text(x, y, label, {
      fontFamily: FONT,
      fontSize: label.length > 1 ? '10px' : '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(91);

    const press = () => { this.state[key] = true; box.setFillStyle(0x0ea5e9, 0.55).setStrokeStyle(3, 0xfde047, 1); };
    const release = () => { this.state[key] = false; box.setFillStyle(0x0f172a, 0.55).setStrokeStyle(3, 0x38bdf8, 0.85); };

    box.on('pointerdown', press);
    box.on('pointerup', release);
    box.on('pointerout', release);
    box.on('pointerover', (pointer) => { if (pointer.isDown) press(); });
    box.release = release;
    return box;
  }

  reset() { this.buttons.forEach((b) => b.release()); }
}
