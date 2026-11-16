# Autoevaluación - Star Defender

Integrantes: Dylan, Ronny, Santiago Guamán y Kened Lugmana.
Preparada por Kened con el aporte del equipo.

Puntos descontados:
- **Rendimiento (−1):** los FPS cumplen de sobra, pero la primera carga en red móvil es lenta (~18 s) por la música.
- **UX/UI (−1):** en celulares angostos los botones táctiles y el inventario comparten un espacio reducido.
- **Código limpio (−1):** quedó un archivo sin uso (`TextureFactory.js`) y no hay pruebas automáticas.
- **README, video y presentación (−1):** no hay captura del menú principal ni del inventario con un arma activa.

## Rúbrica

| Criterio | % | Nota propuesta | Justificación (qué lo demuestra) |
|---|---|---|---|
| Funcionalidad principal | 20 | 20 | Se juega de inicio a fin: menú, 5 oleadas, jefe final, victoria, derrota, pausa y reinicio |
| Mecánicas de juego | 15 | 15 | Disparo, 3 tipos de enemigo, 3 power-ups, vidas, bonus por oleada e inventario con 3 armas temporales |
| Física y colisiones | 10 | 10 | Arcade Physics: overlaps balas-enemigos, jugador-enemigos, jugador-balas, power-ups, cajas y misiles; rebote lateral de power-ups y cajas (`physics/collisions.js`) |
| Arquitectura y modularidad | 15 | 15 | Escenas, objetos, UI, managers, física y audio separados; una clase por responsabilidad; valores en `config.js`; sistema de estados explícito (`GameStateManager`) |
| Rendimiento y optimización | 10 | 9 | Pooling de objetos en todos los grupos; medido: 144.5 FPS de promedio en PC y 60.9 en un celular real (mínimo 59.6, meta 45). Primera carga lenta en red móvil por la música (ver [PRUEBAS.md](PRUEBAS.md)) |
| UX/UI | 10 | 9 | Estilo retro uniforme, HUD con puntos, récord, vidas, oleada, barra del jefe con nombre y fase, inventario con resaltado y barra de tiempo |
| Audio e inmersión | 5 | 5 | Música y 7 efectos con archivos reales, mute en menú, HUD, pausa y tecla M (se guarda en localStorage) |
| Responsividad y táctil | 5 | 5 | Escala FIT, botones táctiles e inventario táctil probados en un celular real (RedMagic 8 Pro) y en emulación de Pixel 9 Pro Fold e iPad Pro 13 (ver [PRUEBAS.md](PRUEBAS.md)) |
| Código limpio y documentación | 5 | 4 | Comentarios en español, nombres descriptivos, README y documentos en `docs/` |
| README, video y presentación | 5 | 4 | README completo, capturas en `docs/capturas/` y video demo |
| **Total** | **100** | **96** | |
| **Total con bonus** | **110** | **106** | |
| Bonus: jefe final con fases | +5 | +5 | DESTRUCTOR con 3 fases, escoltas, espiral, barra por color y recompensa por fase ([JEFE_FINAL.md](JEFE_FINAL.md)) |
| Bonus: sistema de inventario | +5 | +5 | 3 espacios, láser, misiles teledirigidos y onda de choque ([INVENTARIO.md](INVENTARIO.md)) |

## Fortalezas

- **Arquitectura modular:** cada capa sugerida por el docente (Scene Manager, Game Objects, Physics, UI/HUD, Audio y
  Storage) tiene su propia carpeta, y los cambios de los 4 integrantes se unieron sin romper el juego.
- **Sin números mágicos:** el balance del juego (vidas, enemigos, jefe, armas) se ajusta desde `config.js` y las
  oleadas desde `levels.json`.
- **Rendimiento:** todos los objetos que se crean muchas veces (balas, enemigos, power-ups, cajas y misiles) se
  reutilizan con pooling. Resultado medido: el juego va al máximo de la pantalla (144 FPS en PC, 60 FPS en celular),
  muy por encima de los 45 FPS exigidos.
- **Contenido extra:** los dos bonus del documento (jefe con fases e inventario) están implementados y documentados.
- **Robustez:** el sistema de estados impide acciones fuera de lugar (por ejemplo, pausar en el Game Over) y la pausa
  no gasta el tiempo de las armas.

## Limitaciones

- La música pesa 5.8 MB y el total de assets unos 8 MB: con una red móvil simulada (Fast 4G) la primera carga tardó
  unos 18 segundos, frente a 1.7 s en la PC.
- El récord y el progreso se guardan solo en el navegador (localStorage); no hay tabla de puntajes en línea.
- El juego tiene una sola campaña de 5 oleadas y un solo jefe.
- En pantallas táctiles el inventario, los botones de mover y el de fuego comparten la parte inferior; en celulares
  angostos el espacio queda justo.
- El panel de medición de FPS (`?fps`) tapa el puntaje en pantallas angostas (solo afecta a la herramienta de prueba).
- `src/assets/TextureFactory.js` quedó sin uso al pasar a imágenes reales.

## Mejoras futuras

- Comprimir la música (por ejemplo, a OGG de menor calidad o una pista más corta en bucle) para reducir la carga.
- Agregar niveles de dificultad y más oleadas o jefes.
- Tabla de puntajes en línea.
- Opción de controles táctiles configurables (tamaño y posición).
- Eliminar el código sin uso y agregar pruebas automáticas a la lógica de estados e inventario.

## Aporte de cada integrante

| Integrante | Rama | Aporte principal |
|---|---|---|
| Dylan | Dylan_Casa | Jefe final con 3 fases, escoltas y balas por fase; video demo |
| Ronny | feat/assets-audio | Imágenes y audio reales, estilo retro pixel-art, repositorio y entrega final |
| Santiago Guamán | Santiago_Guaman | Inventario de 3 espacios y armas temporales (láser, misiles, onda de choque) |
| Kened Lugmana | Kened_Lugmana | Sistema de estados, medidor de FPS, pruebas, README, capturas y autoevaluación |
