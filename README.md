# Star Defender

Videojuego **Arcade Shooter** hecho con **Phaser 3 + JavaScript + Vite**.
Proyecto del primer bimestre — Aplicaciones Web (Ingeniería en Software).

Defiende la galaxia: sobrevive 5 oleadas, recoge power-ups y derrota al jefe final.

## Requisitos
- Node.js 20.19+ o 22.12+

## Ejecutar
```bash
npm install
npm run dev        # abre http://localhost:5173
```
Compilar: `npm run build` y luego `npm run preview`.

## Controles
| Acción | Teclado | Móvil / tablet |
| --- | --- | --- |
| Mover | Flechas o A / D | botones `<` y `>` |
| Disparar | Espacio (o flecha arriba) | botón FUEGO |
| Pausa | P o ESC | botón `II` |
| Sonido on/off | M | botón SONIDO |

## Reglas
- 3 vidas. Chocar con enemigos o recibir balas quita una vida (1.6 s de invulnerabilidad).
- Power-ups (caen al destruir enemigos): amarillo = disparo triple (8 s), azul = escudo, verde = vida extra.
- Enemigos: *grunt* (recto), *weaver* (zigzag), *gunner* (dispara al jugador), jefe final (oleada 5).
- Victoria: derrotar al jefe. Derrota: quedarse sin vidas.

## Persistencia (localStorage)
High score, oleada alcanzada (botón "Continuar") y configuración de audio (mute).

## Estructura
```
src/
├── main.js              # configuración de Phaser y arranque
├── config.js            # constantes del juego
├── scenes/              # Preload, Menu, Game, Pause, GameOver
├── objects/             # Player, Enemy, Bullet, PowerUp
├── ui/                  # Button, HUD, TouchControls
├── managers/            # WaveManager, StorageManager
├── physics/             # registro de colisiones/overlaps
├── audio/               # AudioManager (música y efectos)
└── assets/              # TextureFactory (sprites generados por código)
public/assets/data/levels.json   # datos de las oleadas (cargado con el Loader)
```

## Arquitectura
`Scene Manager → Game Objects → Physics → UI/HUD → Audio Manager → Storage Manager`

## Créditos
Código, sprites (generados con Phaser Graphics), música y efectos (Web Audio API): propios.
