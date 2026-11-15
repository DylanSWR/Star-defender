# Jefe final: DESTRUCTOR

Responsable: Dylan. Código en `src/objects/Boss.js` (hereda de `Enemy`).
Aparece en la **oleada 5**. Tiene 90 de vida y cambia de fase según la vida que le queda.

| Fase | Vida restante | Ataque | Movimiento | Barra de vida |
|---|---|---|---|---|
| 1 | 100% a 60% | Abanico de 5 balas cada 1.1 s | Vaivén lateral lento | Amarilla |
| 2 | 60% a 30% | Ráfagas de 3 balas dirigidas al jugador cada 0.85 s y 2 escoltas cada 5 s | Vaivén más rápido | Naranja |
| 3 (furia) | menos de 30% | Espiral continua (una bala cada 0.13 s) y abanico de 5 dirigido cada 1.8 s | Vaivén muy rápido y tinte rojo | Roja |

## Balas por fase
| Fase | Imagen | Tamaño |
|---|---|---|
| 1 | `boss_bullet_1.png` (violeta) | normal |
| 2 | `boss_bullet_2.png` (naranja) | 125% |
| 3 | `boss_bullet_3.png` (roja) | 150% |

Se configuran en `BOSS.bullets` de `src/config.js`. Las balas de los enemigos normales siguen siendo verdes.

## Qué pasa en cada momento
- **Entrada:** banner ¡PELIGRO!, la pantalla tiembla y el jefe baja sin disparar hasta llegar a su posición.
- **Cambio de fase:** destello blanco, banner de fase, temblor de pantalla, explosión, sonido y recompensa.
- **Recompensa:** llama a `scene.dropWeaponCrate(x, y)` (la implementa Santiago en el inventario). Mientras no exista,
  suelta un power-up normal (escudo en la fase 2, disparo triple en la fase 3).
- **Muerte:** cadena de explosiones y pantalla de victoria.
- **HUD:** barra de vida con el nombre `DESTRUCTOR  FASE n`, que cambia de color en cada fase.

## Dónde está cada cosa
| Archivo | Qué contiene |
|---|---|
| `src/objects/Boss.js` | Fases, movimiento y ataques del jefe |
| `src/config.js` | `BOSS`: nombre, umbrales de fase y colores; vida del jefe en `ENEMY_TYPES.boss` |
| `src/managers/WaveManager.js` | `spawnBoss()` crea el jefe y lo agrega al grupo de enemigos |
| `src/scenes/GameScene.js` | `onBossSpawn`, `onBossPhase` y la cadena de explosiones al morir |
| `src/ui/HUD.js` | Barra de vida con nombre y color por fase |

## Cómo probarlo rápido
En el navegador, con el juego abierto, abre la consola (F12) y pega:

```js
localStorage.setItem('star-defender-save-v1', JSON.stringify({ highScore: 0, maxLevel: 5, audio: { muted: false } }));
```

Recarga la página y pulsa **CONTINUAR (OLEADA 5)** en el menú. Para volver a empezar desde la oleada 1, borra el
registro con `localStorage.removeItem('star-defender-save-v1')`.

## Capturas del jefe (docs/capturas/)
- `jefe.png`: el jefe en fase 3, con la barra roja y el texto `DESTRUCTOR  FASE 3` visibles.

## Cómo ajustar la dificultad
En `src/config.js`: `hp` del jefe en `ENEMY_TYPES.boss` (más vida = pelea más larga) y los umbrales `phase2At` y `phase3At` en `BOSS`.
