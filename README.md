# CV interactivo de Gabriel Vázquez Ruiz

Currículum web 2D con estética dark fantasy construido con Vue 3,
TypeScript, Pinia, SCSS y Vite.

## Requisitos

- Windows 10 u 11, macOS o Linux.
- [Node.js 22 o posterior](https://nodejs.org/).
- Conexión a internet durante la primera instalación.

## Inicio rápido en Windows

1. Descomprime el proyecto o clona el repositorio.
2. Abre la carpeta resultante.
3. Haz doble clic en `iniciar-windows.bat`.
4. Abre la dirección local que muestre Vite, normalmente
   `http://localhost:5173`.

## Inicio desde una terminal

```bash
npm install
npm run dev
```

Para validar y abrir la versión de producción:

```bash
npm run build
npm run start
```

## Arquitectura

- `src/App.vue`: composición del recorrido y contenido del CV.
- `src/stores/experience.ts`: estado global Pinia, scroll, niveles y movimiento.
- `src/components/scenes/`: un componente y un módulo SCSS por escenario.
- `src/components/characters/`: componentes y animaciones de personajes.
- `src/styles/`: tokens y estilos compartidos del mundo.
- `src/config/`: dimensiones globales y duración de la carga.
- `public/assets/`: imágenes y hojas de sprites, separadas por escena.

Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.
