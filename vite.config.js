// Configuración de Vite. base './' permite abrir el build desde cualquier carpeta.
export default {
  base: './',
  server: { host: true, port: 5173 },
  build: { chunkSizeWarningLimit: 1600 }
};
