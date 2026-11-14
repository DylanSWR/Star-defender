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
    const circle = scene.add.circle(x, y, radius, 0xffffff, 0.18)
      .setStrokeStyle(3, 0xffffff, 0.7).setDepth(90).setInteractive();
    scene.add.text(x, y, label, {
      fontFamily: FONT, fontSize: label.length > 1 ? '18px' : '34px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(91);

    const press = () => { this.state[key] = true; circle.setFillStyle(0xffffff, 0.4); };
    const release = () => { this.state[key] = false; circle.setFillStyle(0xffffff, 0.18); };

    circle.on('pointerdown', press);
    circle.on('pointerup', release);
    circle.on('pointerout', release);
    circle.on('pointerover', (pointer) => { if (pointer.isDown) press(); });
    circle.release = release;
    return circle;
  }

  reset() { this.buttons.forEach((b) => b.release()); }
}
