# Pruebas de rendimiento, responsividad y funcionamiento

Responsable: Kened Lugmana. Se probó la versión final con el trabajo de los 4 integrantes unido
(assets reales, jefe con 3 fases e inventario).

## 1. Rendimiento (requisito 4.8: mínimo 45 FPS)

### Cómo se mide

1. `npm run dev` y abrir `http://localhost:5173/?fps` (o pulsar **F** dentro del juego).
2. El panel muestra los FPS actuales, el **promedio** y el **mínimo**. Solo cuenta mientras el estado es
   `PLAYING`; ignora los 2 primeros segundos, la pausa y la pestaña oculta. Se reinicia en cada partida nueva.
3. Jugar una partida completa (5 oleadas + jefe) usando las armas del inventario y capturar el panel al final.
4. El momento más exigente es el **jefe en fase 3** (espiral de balas) con el **láser o los misiles** activos.
5. Respaldo: Chrome DevTools > `Ctrl+Shift+P` > "Show frame rendering stats".

### Resultados

Fecha de las pruebas: 15/11/2026, con `npm run dev`.

| Dispositivo | Navegador | Momento | FPS promedio | FPS mínimo | ¿Cumple ≥ 45? | Evidencia |
|---|---|---|---|---|---|---|
| PC ASUS TUF A15 (Ryzen 7 serie 7000, RTX 4050) | Navegador de VS Code (Chromium) | Partida desde la oleada 1 | 144.5 | 144.2 | Sí | [fps-pc-partida.png](capturas/pruebas/fps-pc-partida.png) |
| PC ASUS TUF A15 | Navegador de VS Code (Chromium) | Oleada 5: jefe, escoltas y balas | 144.5 | 144.2 | Sí | [fps-pc-jefe.png](capturas/pruebas/fps-pc-jefe.png) |
| PC ASUS TUF A15 | Navegador de VS Code (Chromium) | Partida hasta el Game Over | 143.7 | 141.9 | Sí | [gameover.png](capturas/pruebas/gameover.png) |
| Emulación Pixel 9 Pro Fold (412×922) | Chrome (modo dispositivo) | Oleada 1 | 141.9 | 135.1 | Sí | [pixel-9-pro-fold.png](capturas/pruebas/pixel-9-pro-fold.png) |
| Emulación iPad Pro 13 (1032×1376) | Chrome (modo dispositivo) | Oleada 1 | 120.9 | 107.9 | Sí | [ipad-pro-13.png](capturas/pruebas/ipad-pro-13.png) |
| **Celular real RedMagic 8 Pro** | Chrome Android | Oleadas 1 a 3 | **60.9** | **59.6** | **Sí** | [movil-fps.jpg](capturas/pruebas/movil-fps.jpg) |

**Conclusión:** el juego cumple con amplio margen el mínimo de 45 FPS en todos los dispositivos probados.

- En la PC el juego va a 144 FPS porque es la frecuencia de la pantalla (Phaser se sincroniza con el monitor). Es el
  máximo posible, no un límite del juego.
- En el celular real va a 60 FPS, también el tope del navegador en ese equipo, y el mínimo (59.6) queda 14 FPS por
  encima de la meta.
- Las pruebas con el modo dispositivo de Chrome usan el procesador de la PC; sirven para revisar la interfaz, no para
  medir el rendimiento de un celular. Por eso la prueba de rendimiento móvil se hizo en un celular real.
- La medición del jefe se tomó en la fase 1, con 70 muestras (unos 35 segundos de juego).

Optimizaciones aplicadas: pooling de objetos (balas, enemigos, power-ups, cajas de arma y misiles se reutilizan con
`maxSize`), un solo emisor de partículas para todas las explosiones, assets cargados una sola vez en `PreloadScene` y
tiempos de armas calculados con `delta`.

## 2. Carga de assets (requisito 4.8)

Peso de `public/assets/`: unos **8 MB** (música 5.8 MB, efecto de victoria 1 MB, fondo 740 KB; el resto de sprites
pesa menos de 10 KB cada uno).

**Cómo medir:** DevTools > pestaña **Network** > marcar "Disable cache" > recargar. Anotar el tiempo de `Load` (abajo).
Para simular un celular, en el mismo panel elegir "Fast 4G".

Medido con `npm run dev`: se transfieren 15.7 MB en 81 archivos, porque en modo desarrollo Phaser se envía sin
comprimir y en archivos separados. La versión compilada (`npm run build`) junta y comprime el código.

| Conexión | DOMContentLoaded | Load | Todo descargado (Finish) | Evidencia |
|---|---|---|---|---|
| Sin límite (PC) | 1.06 s | 1.66 s | 1.66 s | [carga-sin-limite.png](capturas/pruebas/carga-sin-limite.png) |
| Fast 4G simulado | 8.64 s | 9.15 s | 17.88 s | [carga-fast4g.png](capturas/pruebas/carga-fast4g.png) |

**Conclusión:** en la PC el menú aparece en menos de 2 segundos. Con una red móvil simulada la primera carga tarda
unos 18 segundos, sobre todo por la música (5.8 MB). Las siguientes visitas son más rápidas porque el navegador guarda
los archivos en caché. Reducir la música es la principal mejora pendiente (ver autoevaluación).

## 3. Responsividad y táctil (requisito 4.7)

### Cómo se prueba

- **Chrome modo dispositivo:** `F12` > `Ctrl+Shift+M`, elegir el dispositivo y **recargar la página**
  (los botones táctiles se detectan al cargar).
- **Celular real:** `npx vite --host`, abrir en el celular la dirección `Network:` que aparece
  (PC y celular en la misma red Wi-Fi; si Windows pregunta por el firewall, permitir).

En móvil el inventario se ubica entre los botones de mover (`<` `>`) y el botón FUEGO; revisar que no se tapen.

### Resultados

| Dispositivo / resolución | Escala correcta | Botones `<` `>` FUEGO | Inventario táctil | Problemas | Evidencia |
|---|---|---|---|---|---|
| PC ASUS TUF A15 (escritorio) | Sí, centrado con franjas a los lados | No aplica (teclado) | Visible abajo al centro | Ninguno | [fps-pc-jefe.png](capturas/pruebas/fps-pc-jefe.png) |
| Emulación iPad Pro 13 (1032×1376) | Sí | Sí, visibles | Sí, entre `>` y FUEGO sin taparse | Ninguno | [ipad-pro-13.png](capturas/pruebas/ipad-pro-13.png) |
| Emulación Pixel 9 Pro Fold (412×922) | Sí | Sí, visibles | Sí, entre `>` y FUEGO; espacio justo | Ninguno | [pixel-9-pro-fold.png](capturas/pruebas/pixel-9-pro-fold.png) |
| Celular real RedMagic 8 Pro | Sí, ocupa toda la pantalla | Sí, visibles | Sí, entre `>` y FUEGO sin taparse | Ninguno | [movil-fps.jpg](capturas/pruebas/movil-fps.jpg) |

Observación: con `?fps` activo, el panel de FPS tapa el puntaje (esquina superior izquierda) en pantallas angostas. Solo
pasa con la herramienta de medición; en el juego normal el panel no aparece.

## 4. Prueba funcional (lista de verificación)

| # | Qué probar | Resultado esperado | OK |
|---|---|---|---|
| 1 | Abrir el juego | Barra de carga y luego el menú con fuente retro | [x] |
| 2 | JUGAR | Empieza la oleada 1, suena la música | [x] (capturas de iPad y Pixel) |
| 3 | Mover y disparar (teclado y táctil) | La nave se mueve y dispara | [x] |
| 4 | Recoger power-ups (triple, escudo, vida) | Se aplica el efecto | [x] |
| 5 | Recoger una caja de arma | Aparece en un espacio del inventario | [x] (fps-pc-jefe.png, láser en el espacio 1) |
| 6 | Activar láser / misiles con 1, 2, 3 | Reemplazan el disparo, la barra de tiempo baja y al final vuelve el disparo normal | [x] |
| 7 | Onda de choque | Borra balas enemigas y daña a todos | [x] |
| 8 | Pausa (P, ESC, botón II) durante un arma activa | Se pausa y el arma no pierde tiempo | [x] |
| 9 | M o botón SONIDO | Silencia y vuelve a activar el audio | [x] |
| 10 | Oleada 5 | Aviso ¡PELIGRO! y aparece el jefe con su barra | [x] (fps-pc-jefe.png) |
| 11 | Fases 2 y 3 del jefe | Cambia el color de la barra, banner, escoltas, espiral y suelta caja | [x] |
| 12 | Derrotar al jefe | Pantalla de ¡VICTORIA! con puntaje y récord | [x] |
| 13 | Perder todas las vidas | Pantalla GAME OVER con botón CONTINUAR | [x] (gameover.png, estado GAME_OVER) |
| 14 | Recargar la página | Se conservan el récord, la oleada para CONTINUAR y el mute | [x] |
| 15 | REINICIAR desde la pausa y JUGAR DE NUEVO | La partida empieza limpia (puntaje 0, inventario vacío) | [x] |

Todas las pruebas funcionales fueron verificadas jugando por Kened el 15/11/2026, sin errores encontrados.

Para llegar rápido al jefe: ver la sección "Cómo probarlo rápido" en [JEFE_FINAL.md](JEFE_FINAL.md).

## 5. Errores encontrados

| Fecha | Descripción | Responsable | Estado |
|---|---|---|---|
| 15/11/2026 | No se encontraron errores en las pruebas | Kened | — |
