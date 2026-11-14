import StorageManager from '../managers/StorageManager.js';

// AudioManager: música de fondo y efectos generados con Web Audio API (sin archivos externos).
// Si quieres usar audio real (Kenney / OpenGameArt) puedes cargarlo con this.load.audio() y
// reemplazar estas funciones por this.sound.play().

const STEP = 0.18; // duración de cada paso de la música, en segundos
const BASS = [55, 55, 65.41, 65.41, 73.42, 73.42, 49, 49];
const ARP = [220, 261.63, 329.63, 261.63, 261.63, 329.63, 392, 329.63,
             293.66, 349.23, 440, 349.23, 196, 246.94, 293.66, 246.94];

class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = StorageManager.muted;
    this.musicTimer = null;
    this.step = 0;
    this.nextTime = 0;
  }

  /** Crea el AudioContext (requiere gesto del usuario) y arranca la música. */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.16;
      this.sfxGain.gain.value = 0.5;
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this._applyMute();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.musicTimer) this.startMusic();
  }

  get isMuted() { return this.muted; }

  toggleMute() {
    this.muted = !this.muted;
    StorageManager.setMuted(this.muted);
    this._applyMute();
    return this.muted;
  }

  _applyMute() {
    if (this.master) this.master.gain.value = this.muted ? 0 : 1;
  }

  // ---------- Música ----------
  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    this.nextTime = this.ctx.currentTime + 0.05;
    this.step = 0;
    this.musicTimer = setInterval(() => this._schedule(), 80);
  }

  stopMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  // Programa notas con un poco de anticipación para que el ritmo sea estable.
  _schedule() {
    while (this.nextTime < this.ctx.currentTime + 0.25) {
      if (this.step % 2 === 0) {
        this._tone(BASS[this.step / 2], this.nextTime, STEP * 1.9, 'triangle', 0.6, this.musicGain);
      }
      this._tone(ARP[this.step], this.nextTime, STEP * 0.8, 'square', 0.12, this.musicGain);
      this.nextTime += STEP;
      this.step = (this.step + 1) % ARP.length;
    }
  }

  // ---------- Efectos ----------
  play(name) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    switch (name) {
      case 'shoot':     this._sweep(900, 250, 0.09, 'square', 0.15, t); break;
      case 'hit':       this._sweep(300, 120, 0.12, 'sawtooth', 0.2, t); break;
      case 'explosion': this._noise(0.35, 0.5, t, 900); break;
      case 'powerup':   [523, 659, 784, 1046].forEach((f, i) => this._tone(f, t + i * 0.07, 0.12, 'triangle', 0.4, this.sfxGain)); break;
      case 'click':     this._tone(660, t, 0.06, 'square', 0.2, this.sfxGain); break;
      case 'win':       [523, 659, 784, 1046, 1318].forEach((f, i) => this._tone(f, t + i * 0.12, 0.2, 'triangle', 0.4, this.sfxGain)); break;
      case 'lose':      [440, 349, 262, 196].forEach((f, i) => this._tone(f, t + i * 0.18, 0.3, 'sawtooth', 0.3, this.sfxGain)); break;
      default: break;
    }
  }

  _tone(freq, t, dur, type, vol, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  _sweep(f0, f1, dur, type, vol, t) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  _noise(dur, vol, t, cutoff) {
    const length = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(gain).connect(this.sfxGain);
    src.start(t);
  }
}

// Instancia única (singleton) compartida por todas las escenas.
export default new AudioManager();
