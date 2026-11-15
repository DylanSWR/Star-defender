import { GAME_HEIGHT as H, INVENTORY, WEAPONS, FONT, COLORS } from '../config.js';

// Interfaz del inventario, en la parte inferior de la pantalla: 3 espacios con ícono y número,
// resaltado del arma activa y una barra con el tiempo restante. Los espacios también se pueden
// tocar (móvil) para activar el arma.
const SLOT_SIZE = 48;
const SLOT_GAP = 6;
const IDLE_STROKE = 0x38bdf8;

export default class InventoryHUD {
  /** centerX: centro horizontal del inventario. En móvil se desplaza para no tapar los botones. */
  constructor(scene, { centerX, onSlot }) {
    const count = INVENTORY.slots;
    const total = count * SLOT_SIZE + (count - 1) * SLOT_GAP;
    const left = centerX - total / 2;
    const slotY = H - 52;
    this.barWidth = total;

    this.slots = [];
    for (let i = 0; i < count; i++) {
      const x = left + SLOT_SIZE / 2 + i * (SLOT_SIZE + SLOT_GAP);
      const box = scene.add.rectangle(x, slotY, SLOT_SIZE, SLOT_SIZE, 0x0f172a, 0.8)
        .setStrokeStyle(3, IDLE_STROKE, 0.7).setDepth(100).setInteractive({ useHandCursor: true });
      const icon = scene.add.image(x, slotY, 'crate_laser').setDepth(101).setVisible(false);
      const num = scene.add.text(x - SLOT_SIZE / 2 + 5, slotY - SLOT_SIZE / 2 + 4, String(i + 1), {
        fontFamily: FONT, fontSize: '9px', color: INVENTORY.textColor, stroke: '#000000', strokeThickness: 3
      }).setDepth(102);
      box.on('pointerdown', () => onSlot(i));
      this.slots.push({ box, icon, num });
    }

    // Barra de tiempo del arma activa (oculta si no hay ninguna).
    const barY = slotY - SLOT_SIZE / 2 - 14;
    this.barBg = scene.add.rectangle(centerX, barY, total, 10, 0x020617, 0.9)
      .setStrokeStyle(2, 0xe2e8f0).setDepth(100).setVisible(false);
    this.barFill = scene.add.rectangle(left + 2, barY, total - 4, 6, 0xffffff)
      .setOrigin(0, 0.5).setDepth(101).setVisible(false);
    this.barLabel = scene.add.text(centerX, barY - 14, '', {
      fontFamily: FONT, fontSize: '8px', color: COLORS.text, stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(101).setVisible(false);
  }

  /** slots: arreglo con el tipo de arma de cada espacio (o null). active: { kind, slot } o null. */
  refresh(slots, active) {
    this.slots.forEach((s, i) => {
      const kind = slots[i];
      if (kind) s.icon.setTexture(`crate_${kind}`).setVisible(true);
      else s.icon.setVisible(false);

      // Resaltado: dorado y grueso en el espacio del arma activa; del color del arma si tiene una guardada.
      const isActive = active && active.slot === i;
      if (isActive) s.box.setStrokeStyle(4, 0xfde047, 1);
      else if (kind) s.box.setStrokeStyle(3, WEAPONS[kind].color, 1);
      else s.box.setStrokeStyle(3, IDLE_STROKE, 0.7);
    });

    const show = !!active;
    this.barBg.setVisible(show);
    this.barFill.setVisible(show);
    this.barLabel.setVisible(show);
    if (show) {
      const def = WEAPONS[active.kind];
      this.barFill.setFillStyle(def.color).setScale(1, 1);
      this.barLabel.setText(def.label);
    }
  }

  /** ratio: de 1 (recién activada) a 0 (se acabó). */
  setTime(ratio) { this.barFill.setScale(Math.max(0, ratio), 1); }
}
