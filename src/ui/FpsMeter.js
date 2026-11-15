import gameState, { STATES } from '../managers/GameStateManager.js';

// Medidor de rendimiento (requisito 4.8: mínimo 45 FPS).
// Panel HTML encima del juego: FPS actuales, promedio y mínimo medidos SOLO mientras se juega.
// Se muestra con la tecla F o abriendo la página con ?fps en la URL (ej. http://localhost:5173/?fps).
// Sirve para tomar la captura de evidencia sin depender de las herramientas del navegador.

const SAMPLE_MS = 500;   // cada cuánto se toma una muestra
const WARMUP_MS = 2000;  // se ignoran los primeros 2 s de cada partida (carga inicial)
const TARGET_FPS = 45;   // mínimo exigido por el documento

export default class FpsMeter {
  constructor(game) {
    this.game = game;
    this.visible = new URLSearchParams(window.location.search).has('fps');
    this.resetStats();

    this.el = document.createElement('div');
    Object.assign(this.el.style, {
      position: 'fixed', top: '8px', left: '8px', zIndex: 10,
      padding: '6px 10px', background: 'rgba(0, 0, 0, 0.75)', color: '#86efac',
      font: 'bold 13px/1.45 monospace', borderRadius: '6px', pointerEvents: 'none',
      whiteSpace: 'pre', display: this.visible ? 'block' : 'none'
    });
    document.body.appendChild(this.el);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') this.toggle();
    });

    // Cada partida nueva empieza con estadísticas limpias.
    gameState.onChange((next, previous) => {
      if (next === STATES.PLAYING && previous !== STATES.PAUSED) this.resetStats();
    });

    this.timer = setInterval(() => this.sample(), SAMPLE_MS);
  }

  resetStats() {
    this.playStart = performance.now();
    this.samples = 0;
    this.sum = 0;
    this.min = Infinity;
  }

  toggle() {
    this.visible = !this.visible;
    this.el.style.display = this.visible ? 'block' : 'none';
  }

  sample() {
    const fps = this.game.loop.actualFps;
    const measuring = gameState.is(STATES.PLAYING)
      && !document.hidden
      && performance.now() - this.playStart > WARMUP_MS;

    if (measuring) {
      this.samples += 1;
      this.sum += fps;
      this.min = Math.min(this.min, fps);
    }
    if (this.visible) this.render(fps);
  }

  render(fps) {
    const avg = this.samples ? this.sum / this.samples : 0;
    const min = this.samples ? this.min : 0;
    const ok = !this.samples || min >= TARGET_FPS;
    this.el.style.color = ok ? '#86efac' : '#fca5a5';
    this.el.textContent = [
      `FPS:      ${fps.toFixed(0)}`,
      `Promedio: ${avg.toFixed(1)}`,
      `Mínimo:   ${min.toFixed(1)}  (meta ${TARGET_FPS})`,
      `Muestras: ${this.samples}`,
      `Estado:   ${gameState.state}`
    ].join('\n');
  }
}
