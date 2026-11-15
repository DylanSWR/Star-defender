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
| Medidor de FPS | F (o abrir con `?fps` en la URL) | - |

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
├── ui/                  # Button, HUD, TouchControls, FpsMeter
├── managers/            # WaveManager, StorageManager, GameStateManager
├── physics/             # registro de colisiones/overlaps
├── audio/               # AudioManager (música y efectos)
└── assets/              # TextureFactory (sprites generados por código)
public/assets/data/levels.json   # datos de las oleadas (cargado con el Loader)
docs/                            # capturas, pruebas y autoevaluación
```

## Arquitectura
`Scene Manager → Game Objects → Physics → UI/HUD → Audio Manager → Storage Manager`

### Sistema de estados
`managers/GameStateManager.js` guarda el estado global de la partida y solo permite cambios válidos:

```
LOADING → MENU → PLAYING ⇄ PAUSED
                    ↓          ↓
               GAME_OVER → MENU / PLAYING
```

Las escenas lo actualizan (`MenuScene` → MENU, `GameScene` → PLAYING / PAUSED / GAME_OVER) y lo
consultan antes de actuar; por ejemplo, solo se puede pausar en PLAYING.

## Rendimiento
Pooling de objetos (balas, enemigos y power-ups se reutilizan), texturas generadas una vez en la carga y
un solo emisor de partículas. Mediciones de FPS y pruebas en móvil: [docs/PRUEBAS.md](docs/PRUEBAS.md).

## Capturas
<!-- Se completan cuando estén las imágenes en docs/capturas/ (ver docs/CAPTURAS.md) -->
| Menú | En juego | Inventario |
| --- | --- | --- |
| ![Menú](docs/capturas/menu.png) | ![Oleada](docs/capturas/oleada.png) | ![Inventario](docs/capturas/inventario.png) |

| Jefe final | Game Over | Móvil y FPS |
| --- | --- | --- |
| ![Jefe](docs/capturas/jefe.png) | ![Game Over](docs/capturas/gameover.png) | ![Móvil y FPS](docs/capturas/movil-fps.png) |

## Integrantes
| Integrante | Responsabilidad |
| --- | --- |
| Dylan | Jefe final con fases y video demo |
| Ronny | Líder técnico, assets reales, repositorio y entrega final |
| Santiago | Sistema de inventario y armas temporales |
| Kened Lugmana | Sistema de estados, pruebas de rendimiento y móvil, documentación y autoevaluación |

Autoevaluación: [docs/AUTOEVALUACION.md](docs/AUTOEVALUACION.md).

## Créditos
Código, sprites (generados con Phaser Graphics), música y efectos (Web Audio API): propios.
