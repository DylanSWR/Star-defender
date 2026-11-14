import { SAVE_KEY } from '../config.js';

// Persistencia con localStorage: high score, nivel alcanzado y configuración de audio.
const DEFAULTS = { highScore: 0, maxLevel: 1, audio: { muted: false } };
let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {};
    cache = {
      highScore: Number(raw.highScore) || 0,
      maxLevel: Number(raw.maxLevel) || 1,
      audio: { ...DEFAULTS.audio, ...(raw.audio || {}) }
    };
  } catch (e) {
    cache = { ...DEFAULTS, audio: { ...DEFAULTS.audio } };
  }
  return cache;
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('No se pudo guardar el progreso', e);
  }
}

const StorageManager = {
  get highScore() { return load().highScore; },
  get maxLevel() { return load().maxLevel; },
  get muted() { return load().audio.muted; },

  /** Guarda el puntaje si supera el récord. Devuelve true si es nuevo récord. */
  submitScore(score) {
    const data = load();
    if (score > data.highScore) {
      data.highScore = score;
      persist();
      return true;
    }
    return false;
  },

  saveLevel(level) {
    const data = load();
    if (level > data.maxLevel) {
      data.maxLevel = level;
      persist();
    }
  },

  resetProgress() {
    load().maxLevel = 1;
    persist();
  },

  setMuted(value) {
    load().audio.muted = !!value;
    persist();
  }
};

export default StorageManager;
