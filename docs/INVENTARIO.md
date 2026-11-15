# Inventario y armas temporales

Responsable: Santiago. Rama: `Santiago_Inventario`.

El jugador recoge **cajas de arma** (las sueltan los enemigos con 10% de probabilidad y el jefe al cambiar de fase),
las guarda en un inventario de **3 espacios** y las activa cuando quiere.

## Controles
| Acción | Teclado | Móvil / mouse |
|---|---|---|
| Activar espacio 1, 2 o 3 | Teclas `1`, `2`, `3` (también teclado numérico) | Tocar el espacio en la parte inferior |
| Usar el arma activa | Mantener el disparo (`ESPACIO` / `↑`) | Mantener el botón FUEGO |

## Armas
| Arma | Efecto | Duración | Datos |
|---|---|---|---|
| Láser | Rayo continuo que atraviesa y daña a todos los enemigos que toca | 8 s | 1 de daño cada 110 ms (~9/s) |
| Misiles | Misiles teledirigidos que buscan al enemigo más cercano | 10 s | 1 misil cada 420 ms, 3 de daño |
| Onda de choque | Borra las balas enemigas y daña a todos los enemigos en pantalla | Un solo uso | 10 de daño |

Reglas:
- Solo hay **un arma temporal activa a la vez** (láser o misiles). Si se intenta activar otra, espera guardada en su espacio.
- La onda de choque es instantánea, así que se puede usar aunque haya otra arma activa.
- Mientras el láser o los misiles están activos **reemplazan el disparo normal**; al terminar vuelve el disparo normal.
- Si el inventario está lleno la caja no se recoge y sigue cayendo.
- El tiempo se descuenta con `delta`, por eso **la pausa no gasta la duración** del arma.
- El inventario se vacía al empezar una partida nueva.

## Interfaz (HUD)
Parte inferior de la pantalla: 3 espacios con número e ícono, borde del color del arma guardada, **borde dorado en el
espacio del arma activa** y una barra de tiempo con el nombre del arma encima. En móvil se corre a la zona libre entre
los botones de mover y de fuego.

## Dónde está cada cosa
| Archivo | Qué contiene |
|---|---|
| `src/managers/InventoryManager.js` | Espacios, activación, láser, misiles, onda de choque, recoger cajas |
| `src/objects/WeaponCrate.js` | Caja de arma (pool, rebota en los bordes y late) |
| `src/objects/Missile.js` | Misil teledirigido (pool) |
| `src/ui/InventoryHUD.js` | Espacios, resaltado y barra de tiempo |
| `src/assets/WeaponTextures.js` | Sprites generados por código (se pueden cambiar por imágenes con las mismas claves) |
| `src/config.js` | `INVENTORY`, `WEAPONS` y `WEAPON_KINDS` (todos los valores de balance) |
| `src/scenes/GameScene.js` | `dropWeaponCrate(x, y, kind)`, creación del inventario y probabilidad de drop |
| `src/objects/Player.js` | `shoot()` deja que el arma activa reemplace el disparo normal |
| `src/ui/HUD.js` | Crea el `InventoryHUD` y expone `setInventory` / `setWeaponTime` |

## Interfaz con el jefe
`scene.dropWeaponCrate(x, y)` (el jefe la llama al cambiar de fase) ya está implementada. Sin tercer argumento el tipo se
sortea; con `kind` (`'laser'`, `'missile'` o `'shock'`) se fuerza un tipo.
