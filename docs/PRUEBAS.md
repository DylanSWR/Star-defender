# Pruebas de rendimiento, responsividad y funcionamiento

Responsable: Kened Lugmana. Se prueba la versión final con el trabajo de los 4 integrantes unido
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

| Dispositivo | Navegador | Momento | FPS promedio | FPS mínimo | ¿Cumple ≥ 45? |
|---|---|---|---|---|---|
| PC (especificar) | Chrome | Partida completa | | | |
| PC (especificar) | Chrome | Jefe fase 3 + arma activa | | | |
| Celular (especificar) | Chrome Android | Partida completa | | | |

Optimizaciones aplicadas: pooling de objetos (balas, enemigos, power-ups, cajas de arma y misiles se reutilizan con
`maxSize`), un solo emisor de partículas para todas las explosiones, assets cargados una sola vez en `PreloadScene` y
tiempos de armas calculados con `delta`.

## 2. Carga de assets (requisito 4.8)

Peso de `public/assets/`: unos **8 MB** (música 5.8 MB, efecto de victoria 1 MB, fondo 740 KB; el resto de sprites
pesa menos de 10 KB cada uno).

**Cómo medir:** DevTools > pestaña **Network** > marcar "Disable cache" > recargar. Anotar el tiempo de `Load` (abajo).
Para simular un celular, en el mismo panel elegir "Fast 4G".

| Conexión | Tiempo hasta el menú (Load) | Observaciones |
|---|---|---|
| Sin límite (PC) | | |
| Fast 4G | | |

## 3. Responsividad y táctil (requisito 4.7)

### Cómo se prueba

- **Chrome modo dispositivo:** `F12` > `Ctrl+Shift+M`, elegir el dispositivo y **recargar la página**
  (los botones táctiles se detectan al cargar).
- **Celular real:** `npx vite --host`, abrir en el celular la dirección `Network:` que aparece
  (PC y celular en la misma red Wi-Fi; si Windows pregunta por el firewall, permitir).

En móvil el inventario se ubica entre los botones de mover (`<` `>`) y el botón FUEGO; revisar que no se tapen.

### Resultados

| Dispositivo / resolución | Escala correcta | Botones `<` `>` FUEGO | Inventario táctil | Multitáctil (mover + disparar) | Problemas |
|---|---|---|---|---|---|
| Escritorio 1920×1080 | | No aplica | Con mouse | No aplica | |
| Tablet (iPad, 768×1024) | | | | | |
| Móvil (Pixel 7, 412×915) | | | | | |
| Celular real (especificar) | | | | | |

## 4. Prueba funcional (lista de verificación)

| # | Qué probar | Resultado esperado | OK |
|---|---|---|---|
| 1 | Abrir el juego | Barra de carga y luego el menú con fuente retro | [ ] |
| 2 | JUGAR | Empieza la oleada 1, suena la música | [ ] |
| 3 | Mover y disparar (teclado y táctil) | La nave se mueve y dispara | [ ] |
| 4 | Recoger power-ups (triple, escudo, vida) | Se aplica el efecto | [ ] |
| 5 | Recoger una caja de arma | Aparece en un espacio del inventario | [ ] |
| 6 | Activar láser / misiles con 1, 2, 3 | Reemplazan el disparo, la barra de tiempo baja y al final vuelve el disparo normal | [ ] |
| 7 | Onda de choque | Borra balas enemigas y daña a todos | [ ] |
| 8 | Pausa (P, ESC, botón II) durante un arma activa | Se pausa y el arma no pierde tiempo | [ ] |
| 9 | M o botón SONIDO | Silencia y vuelve a activar el audio | [ ] |
| 10 | Oleada 5 | Aviso ¡PELIGRO! y aparece el jefe con su barra | [ ] |
| 11 | Fases 2 y 3 del jefe | Cambia el color de la barra, banner, escoltas, espiral y suelta caja | [ ] |
| 12 | Derrotar al jefe | Pantalla de ¡VICTORIA! con puntaje y récord | [ ] |
| 13 | Perder todas las vidas | Pantalla GAME OVER con botón CONTINUAR | [ ] |
| 14 | Recargar la página | Se conservan el récord, la oleada para CONTINUAR y el mute | [ ] |
| 15 | REINICIAR desde la pausa y JUGAR DE NUEVO | La partida empieza limpia (puntaje 0, inventario vacío) | [ ] |

Para llegar rápido al jefe: ver la sección "Cómo probarlo rápido" en [JEFE_FINAL.md](JEFE_FINAL.md).

## 5. Errores encontrados

| Fecha | Descripción | Responsable | Estado |
|---|---|---|---|
| | | | |
