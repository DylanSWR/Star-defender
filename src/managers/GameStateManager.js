// Sistema de estados del juego (requisito 4.1).
// Guarda en un solo lugar en qué estado está la partida y solo permite los cambios válidos.
// Las escenas lo consultan antes de actuar (por ejemplo, no se puede pausar si no se está jugando).

export const STATES = Object.freeze({
  LOADING: 'LOADING',
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER'
});

// Transiciones permitidas: estado actual -> estados a los que puede pasar.
const TRANSITIONS = {
  [STATES.LOADING]: [STATES.MENU],
  [STATES.MENU]: [STATES.PLAYING],
  [STATES.PLAYING]: [STATES.PAUSED, STATES.GAME_OVER, STATES.PLAYING],
  [STATES.PAUSED]: [STATES.PLAYING, STATES.MENU],
  [STATES.GAME_OVER]: [STATES.PLAYING, STATES.MENU]
};

let current = STATES.LOADING;
const listeners = new Set();

const GameStateManager = {
  /** Estado actual (uno de STATES). */
  get state() { return current; },

  /** true si el estado actual es el indicado. */
  is(state) { return current === state; },

  /** true si se puede pasar del estado actual al indicado. */
  canChange(next) {
    return TRANSITIONS[current].includes(next);
  },

  /**
   * Cambia de estado si la transición es válida. Devuelve true si cambió.
   * Una transición inválida no rompe el juego: solo se avisa en consola.
   */
  set(next) {
    if (!STATES[next]) {
      console.warn(`[Estado] Estado desconocido: ${next}`);
      return false;
    }
    if (!this.canChange(next)) {
      console.warn(`[Estado] Transición no válida: ${current} -> ${next}`);
      return false;
    }
    const previous = current;
    current = next;
    listeners.forEach((fn) => fn(next, previous));
    return true;
  },

  /** Registra una función que se llama en cada cambio: fn(nuevo, anterior). Devuelve cómo quitarla. */
  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
};

export default GameStateManager;
