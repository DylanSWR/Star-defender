// Constantes globales del juego. Centralizarlas evita "números mágicos" en el código.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const FONT = 'Arial, Helvetica, sans-serif';
export const COLORS = { text: '#ffffff', accent: '#38bdf8', gold: '#fde68a', danger: '#fca5a5', ok: '#86efac' };

export const SAVE_KEY = 'star-defender-save-v1';

export const TOTAL_LEVELS = 5; // La oleada 5 es el jefe final.

export const PLAYER = {
  speed: 340,
  fireDelay: 210,   // ms entre disparos
  lives: 3,
  maxLives: 5,
  invulnMs: 1600,   // invulnerabilidad tras recibir daño
  tripleMs: 8000,   // duración del power-up de disparo triple
  y: GAME_HEIGHT - 150
};

// Tipos de enemigo. "move" decide el patrón de movimiento (ver objects/Enemy.js).
export const ENEMY_TYPES = {
  grunt:  { texture: 'enemy1', hp: 1,  speed: 110, score: 10,  move: 'straight', fireDelay: 0 },
  weaver: { texture: 'enemy2', hp: 2,  speed: 95,  score: 25,  move: 'sine',     fireDelay: 0 },
  gunner: { texture: 'enemy3', hp: 3,  speed: 75,  score: 40,  move: 'straight', fireDelay: 1800 },
  boss:   { texture: 'boss',   hp: 70, speed: 70,  score: 500, move: 'boss',     fireDelay: 1100, boss: true }
};

export const POWERUP_KINDS = ['triple', 'shield', 'life'];
export const POWERUP_DROP_CHANCE = 0.14;
