import Phaser from 'phaser';
import { INVENTORY, WEAPONS, WEAPON_KINDS, COLORS, FONT, GAME_WIDTH as W } from '../config.js';
import WeaponCrate from '../objects/WeaponCrate.js';
import Missile from '../objects/Missile.js';
import { generateWeaponTextures } from '../assets/WeaponTextures.js';
import audio from '../audio/AudioManager.js';

// Inventario de 3 espacios y armas temporales del jugador.
//
// Flujo: un enemigo o el jefe suelta una caja (dropWeaponCrate) -> el jugador la recoge y se
// guarda en un espacio -> con 1, 2 o 3 (o tocando el espacio) se activa el arma:
//   - Láser y misiles: duran unos segundos y reemplazan el disparo normal. Al terminar vuelve
//     el disparo normal.
//   - Onda de choque: un solo uso, efecto instantáneo.
//
// Los tiempos se descuentan con "delta" (no con el reloj de la escena) para que la pausa
// no gaste la duración del arma.
export default class InventoryManager {
  constructor(scene) {
    this.scene = scene;
    generateWeaponTextures(scene);

    this.slots = new Array(INVENTORY.slots).fill(null); // cada espacio guarda un tipo de arma o null
    this.active = null;       // arma temporal en uso: { kind, slot, remaining }
    this.firing = false;      // el jugador mantiene el botón de disparo en este frame
    this.missileCooldown = 0;
    this.laserCooldown = 0;
    this.fullMsgAt = -9999;
    this.missileSide = 1;

    // Pools de cajas y misiles.
    this.crates = scene.physics.add.group({ classType: WeaponCrate, defaultKey: 'crate_laser', maxSize: 6, runChildUpdate: true });
    this.missiles = scene.physics.add.group({ classType: Missile, defaultKey: 'missile', maxSize: 20 });

    // Rayo láser: una imagen de color con núcleo blanco, oculta hasta que se usa.
    const beamW = WEAPONS.laser.beamWidth;
    this.beam = scene.add.image(0, 0, 'beam').setOrigin(0.5, 1).setDepth(8)
      .setTint(WEAPONS.laser.color).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    this.beamCore = scene.add.image(0, 0, 'beam').setOrigin(0.5, 1).setDepth(8)
      .setAlpha(0.95).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    this.beamW = beamW;

    // Contactos: el jugador recoge cajas y los misiles golpean enemigos.
    scene.physics.add.overlap(scene.player, this.crates, (p, crate) => this.collect(crate));
    scene.physics.add.overlap(this.missiles, scene.enemies, (missile, enemy) => this.onMissileHit(missile, enemy));

    // Teclado: 1, 2 y 3 (también el teclado numérico).
    const kb = scene.input.keyboard;
    for (let i = 0; i < INVENTORY.slots; i++) {
      const name = ['ONE', 'TWO', 'THREE'][i];
      kb.on(`keydown-${name}`, () => this.activate(i));
      kb.on(`keydown-NUMPAD_${name}`, () => this.activate(i));
    }
  }

  // ---------- Cajas ----------
  /** Suelta una caja de arma (aleatoria o del tipo indicado) en la posición dada. */
  dropCrate(x, y, kind) {
    const crate = this.crates.get(x, y);
    if (!crate) return; // pool lleno: se ignora
    crate.spawn(kind || Phaser.Utils.Array.GetRandom(WEAPON_KINDS), x, y);
  }

  collect(crate) {
    if (!crate.active) return;
    const free = this.slots.indexOf(null);
    if (free === -1) {
      // Inventario lleno: la caja no se recoge, solo se avisa (como mucho cada 1.2 s).
      const now = this.scene.time.now;
      if (now - this.fullMsgAt > 1200) {
        this.fullMsgAt = now;
        this.floatText(this.scene.player.x, this.scene.player.y - 40, 'INVENTARIO LLENO', COLORS.danger);
      }
      return;
    }
    this.slots[free] = crate.kind;
    crate.disableBody(true, true);
    this.floatText(crate.x, crate.y - 10, `+ ${WEAPONS[crate.kind].label}`, COLORS.ok);
    audio.play('powerup');
    this.refreshHud();
  }

  // ---------- Activación ----------
  /** Usa el arma guardada en el espacio indicado. Devuelve true si se activó. */
  activate(slot) {
    const scene = this.scene;
    if (scene.finished || !scene.player.active) return false;
    const kind = this.slots[slot];
    if (!kind) return false;

    if (kind === 'shock') {
      this.slots[slot] = null;
      this.refreshHud();
      this.shockwave();
      return true;
    }

    // Solo un arma temporal a la vez; la otra espera guardada en su espacio.
    if (this.active) {
      this.floatText(scene.player.x, scene.player.y - 40, 'ARMA EN USO', COLORS.gold);
      return false;
    }

    this.slots[slot] = null;
    this.active = { kind, slot, remaining: WEAPONS[kind].durationMs };
    this.laserCooldown = 0;
    this.missileCooldown = 0;
    audio.play('powerup');
    this.refreshHud();
    return true;
  }

  /**
   * Lo llama Player.shoot() cada vez que se mantiene el disparo. Si hay un arma temporal
   * activa, ella reemplaza el disparo normal y devuelve true; si no, devuelve false.
   */
  fireSpecial() {
    if (!this.active) return false;
    this.firing = true;
    return true;
  }

  // ---------- Actualización por frame ----------
  update(delta) {
    const wasFiring = this.firing;
    this.firing = false;

    const act = this.active;
    if (!act) { this.hideBeam(); return; }

    act.remaining -= delta;
    const def = WEAPONS[act.kind];
    this.scene.hud.setWeaponTime(Math.max(0, act.remaining / def.durationMs));

    if (act.kind === 'laser') this.updateLaser(delta, wasFiring);
    else this.hideBeam();

    if (act.kind === 'missile') {
      this.missileCooldown -= delta;
      if (wasFiring && this.missileCooldown <= 0) {
        this.missileCooldown = def.fireDelay;
        this.launchMissile();
      }
    }

    if (act.remaining <= 0) this.endActive();
  }

  endActive() {
    this.active = null;
    this.hideBeam();
    this.refreshHud();
  }

  /** Apaga todo (fin de la partida). */
  stopAll() {
    this.active = null;
    this.firing = false;
    this.hideBeam();
    this.refreshHud();
  }

  // ---------- Láser ----------
  updateLaser(delta, firing) {
    if (!firing || !this.scene.player.active) { this.hideBeam(); return; }

    const def = WEAPONS.laser;
    const p = this.scene.player;
    const originY = p.y - 24;
    const flicker = this.beamW * (0.85 + Math.random() * 0.25);
    this.beam.setPosition(p.x, originY).setDisplaySize(flicker + 8, originY).setVisible(true);
    this.beamCore.setPosition(p.x, originY).setDisplaySize(Math.max(4, flicker * 0.3), originY).setVisible(true);

    // El rayo atraviesa: daña a TODOS los enemigos que toca, cada "tickMs".
    this.laserCooldown -= delta;
    if (this.laserCooldown > 0) return;
    this.laserCooldown = def.tickMs;

    const left = p.x - def.beamWidth / 2;
    const right = p.x + def.beamWidth / 2;
    this.scene.enemies.getChildren().slice().forEach((e) => {
      if (this.scene.finished || !e.active || !e.body) return;
      const b = e.body;
      if (b.right > left && b.left < right && b.bottom > 0 && b.top < originY) {
        this.scene.explode(e.x, e.y + e.displayHeight * 0.3, 2);
        e.hit(def.damage);
      }
    });
  }

  hideBeam() {
    if (this.beam.visible) { this.beam.setVisible(false); this.beamCore.setVisible(false); }
  }

  // ---------- Misiles ----------
  launchMissile() {
    const def = WEAPONS.missile;
    const p = this.scene.player;
    this.missileSide *= -1; // alterna izquierda y derecha
    const x = p.x + this.missileSide * 14;
    const y = p.y - 20;
    const missile = this.missiles.get(x, y);
    if (!missile) return;
    const heading = -Math.PI / 2 + Phaser.Math.DegToRad(def.launchSpread) * this.missileSide;
    missile.launch(x, y, heading);
    audio.play('shoot');
  }

  onMissileHit(missile, enemy) {
    if (!missile.active || !enemy.active) return;
    missile.disableBody(true, true);
    this.scene.explode(missile.x, missile.y, 10);
    const died = enemy.hit(WEAPONS.missile.damage);
    if (!died) audio.play('hit');
  }

  // ---------- Onda de choque ----------
  shockwave() {
    const scene = this.scene;
    const def = WEAPONS.shock;
    const p = scene.player;

    // Borra todas las balas enemigas.
    scene.enemyBullets.getChildren().forEach((b) => { if (b.active) b.disableBody(true, true); });

    // Anillo que se expande desde la nave, destello y temblor.
    const ring = scene.add.circle(p.x, p.y, 12, def.color, 0.18).setStrokeStyle(6, def.color).setDepth(60);
    scene.tweens.add({
      targets: ring, scale: 60, alpha: 0, duration: 550, ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
    scene.cameras.main.flash(220, 167, 139, 250);
    scene.cameras.main.shake(260, 0.012);
    audio.play('explosion');

    // Daño a todos los enemigos que ya están en pantalla.
    scene.enemies.getChildren().slice().forEach((e) => {
      if (scene.finished || !e.active || e.y < 0) return;
      e.hit(def.damage);
    });
  }

  // ---------- Utilidades ----------
  refreshHud() {
    this.scene.hud.setInventory(this.slots, this.active ? { kind: this.active.kind, slot: this.active.slot } : null);
  }

  floatText(x, y, text, color) {
    const t = this.scene.add.text(Phaser.Math.Clamp(x, 70, W - 70), y, text, {
      fontFamily: FONT, fontSize: '9px', color, stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(96);
    this.scene.tweens.add({
      targets: t, y: y - 36, alpha: 0, duration: 900, onComplete: () => t.destroy()
    });
  }
}
