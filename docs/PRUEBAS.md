# Pruebas de rendimiento y responsividad

Responsable: Kened. Se prueba sobre `develop` con todo el trabajo del equipo unido.

## 1. Rendimiento (requisito 4.8: mínimo 45 FPS)

### Cómo se mide

1. `npm run dev` y abrir `http://localhost:5173/?fps` (o pulsar **F** dentro del juego).
2. El panel muestra los FPS actuales, el **promedio** y el **mínimo**. Solo cuenta mientras el estado es
   `PLAYING`; ignora los 2 primeros segundos, la pausa y la pestaña oculta.
3. Jugar una partida completa (5 oleadas + jefe) y capturar el panel al final.
4. Respaldo: Chrome DevTools > `Ctrl+Shift+P` > "Show frame rendering stats".

### Resultados

| Dispositivo | Navegador | Momento | FPS promedio | FPS mínimo | ¿Cumple ≥ 45? |
|---|---|---|---|---|---|
| PC (especificar) | Chrome | Partida completa | | | |
| PC (especificar) | Chrome | Jefe final + inventario | | | |
| Celular (especificar) | Chrome Android | Partida completa | | | |

Optimizaciones aplicadas: pooling de objetos (balas, enemigos y power-ups se reutilizan con `maxSize`),
texturas generadas una sola vez en la carga y un solo emisor de partículas para todas las explosiones.

## 2. Responsividad (requisito 4.7)

### Cómo se prueba

- **Chrome modo dispositivo:** `F12` > `Ctrl+Shift+M`, elegir el dispositivo y **recargar la página**
  (los botones táctiles se detectan al cargar).
- **Celular real:** `npx vite --host`, abrir en el celular la dirección `Network:` que aparece
  (PC y celular en la misma red Wi-Fi).

### Resultados

| Dispositivo / resolución | Escala correcta | Botones táctiles | Multitáctil (mover + disparar) | Problemas encontrados |
|---|---|---|---|---|
| Escritorio 1920×1080 | | No aplica | No aplica | |
| Tablet (iPad, 768×1024) | | | | |
| Móvil (Pixel 7, 412×915) | | | | |
| Celular real (especificar) | | | | |

## 3. Errores reportados al equipo

| Fecha | Descripción | Responsable | Estado |
|---|---|---|---|
| | | | |
