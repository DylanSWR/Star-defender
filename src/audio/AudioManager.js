import StorageManager from '../managers/StorageManager.js';

// AudioManager: administra la música de fondo (loop) y los efectos de sonido reales
// cargados en PreloadScene mediante el SoundManager de Phaser, conservando mute en localStorage.

const MUSIC_VOLUME = 0.25;
const SFX_VOLUMES = {
  shoot: 0.32,
  hit: 0.50,
  explosion: 0.60,
  powerup: 0.55,
  click: 0.45,
  win: 0.65,
  lose: 0.65
};
const SHOOT_COOLDOWN_MS = 55;

class AudioManager {
  constructor() {
    this.sound = null;
    this.music = null;
    this.muted = StorageManager.muted;
    this.lastPlayed = {};
  }

  /** Vincula el SoundManager de Phaser tras completar la precarga en PreloadScene. */
  init(soundManager) {
    this.sound = soundManager;
    this._applyMute();

    if (this.sound.locked) {
      this.sound.once('unlocked', () => this.startMusic());
    } else {
      this.startMusic();
    }
  }

  /** Desbloquea el contexto de audio tras el primer gesto del usuario y arranca la música. */
  unlock() {
    if (!this.sound) return;
    if (this.sound.context && this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
    if (!this.sound.locked) {
      this.startMusic();
    }
  }

  get isMuted() { return this.muted; }

  toggleMute() {
    this.muted = !this.muted;
    StorageManager.setMuted(this.muted);
    this._applyMute();
    if (!this.muted) this.startMusic();
    return this.muted;
  }

  _applyMute() {
    if (this.sound) {
      this.sound.setMute(this.muted);
    }
  }

  // ---------- Música ----------
  startMusic() {
    if (!this.sound || this.sound.locked) return;
    if (this.music) {
      if (!this.music.isPlaying) this.music.play();
      return;
    }
    if (!this.sound.game?.cache?.audio?.exists('music')) return;
    this.music = this.sound.add('music', { loop: true, volume: MUSIC_VOLUME });
    this.music.play();
  }

  stopMusic() {
    if (this.music && this.music.isPlaying) {
      this.music.stop();
    }
  }

  // ---------- Efectos ----------
  play(name) {
    if (!this.sound || this.muted || this.sound.locked) return;
    if (!this.sound.game?.cache?.audio?.exists(name)) return;

    const now = performance.now();
    if (name === 'shoot' && now - (this.lastPlayed.shoot || 0) < SHOOT_COOLDOWN_MS) {
      return;
    }
    this.lastPlayed[name] = now;

    const volume = SFX_VOLUMES[name] ?? 0.5;
    this.sound.play(name, { volume });
  }
}

// Instancia única (singleton) compartida por todas las escenas.
export default new AudioManager();
