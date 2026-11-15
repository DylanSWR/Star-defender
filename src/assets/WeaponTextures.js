import { WEAPONS } from '../config.js';

// Genera por código los sprites del inventario (cajas/íconos, misil y rayo), igual que
// TextureFactory. Si luego hay imágenes reales, basta con cargarlas en PreloadScene con las
// mismas claves: crate_laser, crate_missile, crate_shock, missile y beam.
export function generateWeaponTextures(scene) {
  if (scene.textures.exists('crate_laser')) return; // ya generadas (la escena se reinició)

  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const make = (key, w, h, draw) => {
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };

  // Caja de 36x36: fondo oscuro, borde del color del arma y un ícono en el centro.
  const crate = (key, color, icon) => make(key, 36, 36, (p) => {
    p.fillStyle(0x0f172a).fillRoundedRect(0, 0, 36, 36, 6);
    p.lineStyle(3, color).strokeRoundedRect(1.5, 1.5, 33, 33, 6);
    icon(p, color);
  });

  crate('crate_laser', WEAPONS.laser.color, (p, c) => {
    p.fillStyle(c, 0.45).fillRect(12, 5, 12, 26);
    p.fillStyle(0xffffff).fillRect(16, 5, 4, 26);
  });

  crate('crate_missile', WEAPONS.missile.color, (p, c) => {
    p.fillStyle(0xe2e8f0).fillRect(15, 11, 6, 16);
    p.fillStyle(c).fillTriangle(18, 4, 14, 12, 22, 12);
    p.fillStyle(c).fillTriangle(15, 27, 9, 32, 15, 22).fillTriangle(21, 27, 27, 32, 21, 22);
  });

  crate('crate_shock', WEAPONS.shock.color, (p, c) => {
    p.lineStyle(2, c).strokeCircle(18, 18, 13).strokeCircle(18, 18, 8);
    p.fillStyle(0xffffff).fillCircle(18, 18, 3);
  });

  make('missile', 10, 24, (p) => {
    p.fillStyle(0xfb923c).fillTriangle(5, 12, 1, 24, 9, 24); // llama
    p.fillStyle(0xe2e8f0).fillRect(2, 6, 6, 14);
    p.fillStyle(0xf59e0b).fillTriangle(5, 0, 1, 7, 9, 7);
  });

  make('beam', 8, 8, (p) => p.fillStyle(0xffffff).fillRect(0, 0, 8, 8));

  g.destroy();
}
