// Constantes globales del juego. Centralizarlas evita "números mágicos" en el código.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const FONT = '"Press Start 2P", "Courier New", monospace';
export const COLORS = { text: '#ffffff', accent: '#38bdf8', gold: '#fde047', danger: '#fb7185', ok: '#4ade80' };

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
  grunt:  { texture: 'enemy1', scale: 0.44, hp: 1,  speed: 110, score: 10,  move: 'straight', fireDelay: 0 },
  weaver: { texture: 'enemy2', scale: 0.44, hp: 2,  speed: 95,  score: 25,  move: 'sine',     fireDelay: 0 },
  gunner: { texture: 'enemy3', scale: 0.42, hp: 3,  speed: 75,  score: 40,  move: 'straight', fireDelay: 1800 },
  boss:   { texture: 'boss',   scale: 0.85, hp: 90, speed: 70,  score: 500, move: 'boss',     fireDelay: 1100, boss: true }
};

// Jefe final: nombre, posición de combate, umbrales de fase (fracción de vida) y colores de la barra.
export const BOSS = {
  name: 'DESTRUCTOR',
  hoverY: 140,
  phase2At: 0.6,   // por debajo de 60% de vida pasa a la fase 2
  phase3At: 0.3,   // por debajo de 30% pasa a la fase 3 (furia)
  colors: { 1: 0xfacc15, 2: 0xf97316, 3: 0xef4444 },
  furyTint: 0xff8f8f,
  // Bala del jefe en cada fase: imagen (cargada en PreloadScene) y tamaño.
  // Para cambiarlas: reemplaza los PNG de public/assets/images/boss_bullet_N.png o cambia 'texture' y 'scale' aquí.
  bullets: {
    1: { texture: 'bossBullet1', scale: 1 },     // violeta
    2: { texture: 'bossBullet2', scale: 1.25 },  // naranja
    3: { texture: 'bossBullet3', scale: 1.5 }    // roja, más grande
  }
};

export const POWERUP_KINDS = ['triple', 'shield', 'life'];
export const POWERUP_DROP_CHANCE = 0.14;
