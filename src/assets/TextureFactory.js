import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H } from '../config.js';

// Genera todos los sprites por código con Phaser.Graphics, así el proyecto no depende de
// archivos de imagen. Para usar arte propio (p. ej. de Kenney) carga las imágenes en
// PreloadScene con this.load.image('player', 'player.png') y quita la función correspondiente.
export function generateTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const make = (key, w, h, draw) => {
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };

  make('player', 40, 48, (p) => {
    p.fillStyle(0x38bdf8).fillTriangle(20, 0, 0, 46, 40, 46);
    p.fillStyle(0x0369a1).fillTriangle(20, 14, 10, 40, 30, 40);
    p.fillStyle(0xffffff).fillCircle(20, 26, 5);
    p.fillStyle(0xf97316).fillRect(8, 44, 6, 4).fillRect(26, 44, 6, 4);
  });

  make('enemy1', 36, 36, (p) => {
    p.fillStyle(0xef4444).fillPoints([{ x: 18, y: 0 }, { x: 36, y: 18 }, { x: 18, y: 36 }, { x: 0, y: 18 }], true);
    p.fillStyle(0x7f1d1d).fillCircle(18, 18, 7);
    p.fillStyle(0xffffff).fillCircle(18, 18, 2);
  });

  make('enemy2', 44, 34, (p) => {
    p.fillStyle(0xa855f7).fillEllipse(22, 17, 44, 22);
    p.fillStyle(0x7e22ce).fillTriangle(0, 8, 14, 17, 0, 30).fillTriangle(44, 8, 30, 17, 44, 30);
    p.fillStyle(0xe9d5ff).fillCircle(22, 14, 7);
  });

  make('enemy3', 44, 44, (p) => {
    p.fillStyle(0xf97316).fillRoundedRect(4, 4, 36, 32, 8);
    p.fillStyle(0x7c2d12).fillRect(18, 32, 8, 12).fillRect(10, 12, 24, 6);
    p.fillStyle(0xfde047).fillCircle(22, 24, 4);
  });

  make('boss', 140, 90, (p) => {
    p.fillStyle(0x991b1b).fillTriangle(0, 40, 30, 15, 30, 70).fillTriangle(140, 40, 110, 15, 110, 70);
    p.fillStyle(0xdc2626).fillRoundedRect(10, 18, 120, 50, 16);
    p.fillStyle(0x7f1d1d).fillTriangle(70, 90, 30, 60, 110, 60);
    p.fillStyle(0x450a0a).fillRect(26, 66, 10, 16).fillRect(104, 66, 10, 16).fillRect(65, 70, 10, 18);
    p.fillStyle(0xfde047).fillCircle(70, 42, 14);
    p.fillStyle(0xffffff).fillCircle(70, 42, 5);
  });

  make('bullet', 6, 18, (p) => p.fillStyle(0x67e8f9).fillRoundedRect(0, 0, 6, 18, 3));
  make('enemyBullet', 10, 10, (p) => p.fillStyle(0xfb7185).fillCircle(5, 5, 5));
  make('spark', 6, 6, (p) => p.fillStyle(0xfbbf24).fillCircle(3, 3, 3));

  make('pu_triple', 30, 30, (p) => {
    p.fillStyle(0xfacc15).fillCircle(15, 15, 14);
    p.fillStyle(0x713f12).fillRect(8, 8, 3, 14).fillRect(14, 8, 3, 14).fillRect(20, 8, 3, 14);
  });
  make('pu_shield', 30, 30, (p) => {
    p.fillStyle(0x3b82f6).fillCircle(15, 15, 14);
    p.lineStyle(3, 0xffffff).strokeCircle(15, 15, 7);
  });
  make('pu_life', 30, 30, (p) => {
    p.fillStyle(0x22c55e).fillCircle(15, 15, 14);
    p.fillStyle(0xffffff).fillRect(13, 7, 4, 16).fillRect(7, 13, 16, 4);
  });

  make('shield', 64, 64, (p) => {
    p.fillStyle(0x60a5fa, 0.18).fillCircle(32, 32, 30);
    p.lineStyle(3, 0x93c5fd).strokeCircle(32, 32, 30);
  });

  // Dos capas de estrellas para el efecto parallax del fondo.
  make('stars1', W, H, (p) => {
    for (let i = 0; i < 90; i++) {
      p.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.3, 0.9));
      p.fillRect(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), 1, 1);
    }
  });
  make('stars2', W, H, (p) => {
    for (let i = 0; i < 30; i++) {
      p.fillStyle(0xbfdbfe, Phaser.Math.FloatBetween(0.5, 1));
      p.fillRect(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), 2, 2);
    }
  });

  g.destroy();
}
