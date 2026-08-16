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

- `src/App.vue`: shell global del router y host de modales.
- `src/views/ExperienceView.vue`: composición del recorrido y contenido del CV.
- `src/views/ModalLabView.vue`: catálogo visual para probar modales aislados.
- `src/stores/experience.ts`: estado global Pinia, scroll, niveles y movimiento.
- `src/stores/scene-modals.ts`: estado, temporizador y ubicación activa de los avisos.
- `src/components/scenes/`: un componente y un módulo SCSS por escenario.
- `src/components/modals/scenes/`: modales reutilizables para cambios de lugar.
- `src/components/characters/`: componentes y animaciones de personajes.
- `src/styles/`: tokens y estilos compartidos del mundo.
- `src/config/`: dimensiones globales y duración de la carga.
- `public/assets/`: imágenes y hojas de sprites, separadas por escena.

## Configuración sin recompilar

El archivo `public/settings.json` controla la experiencia en tiempo de ejecución.
Después de editarlo, basta con recargar la página durante el desarrollo. En una
publicación solo es necesario sustituir también ese archivo JSON en el servidor.

Opciones principales:

- `defaultMode`: modo que se abre inicialmente.
- `rememberLastMode`: recuerda en el navegador la última elección.
- `loading.durationSeconds`: duración de la pantalla de carga.
- `loading.modeSelectorEnabled`: muestra las opciones de experiencia en el loading.
- `modals.sceneDurationSeconds`: duración total de los avisos de ubicación.
- `modals.scenePalettes`: dominio visual, colores de runas, brillo, aura y partículas por escenario.
- `modes.<modo>.enabled`: habilita o deshabilita una modalidad.
- `modes.<modo>.scenes`: determina qué escenarios se muestran.
- `modes.<modo>.features`: reserva las funciones RPG de mapa, menú e inventario.

`public/settings.schema.json` documenta y valida todas las opciones. El proyecto
también incluye una configuración segura de respaldo por si el JSON se daña.

## Laboratorio de modales

Con el servidor de desarrollo activo, abre:

```text
http://localhost:5173/test/modals
```

La página permite reproducir cada aviso de escena, cambiar el color del lienzo
y ajustar temporalmente su duración; el fondo inicial es negro. Para conservar
la duración después de recargar, edita `modals.sceneDurationSeconds` en
`public/settings.json`. Los textos y tonos disponibles para el recorrido se
centralizan en `src/config/scene-location-notices.ts`.

Cada entrada de `modals.scenePalettes` acepta `sceneDomain` (`phoenix` o
`dragon`), `runeColor`, `glowColor`,
`auraColor` y un arreglo `particleColors`. Los escenarios luminosos y
corrompidos pueden compartir una paleta o utilizar una propia mediante el campo
`paletteId` de cada aviso.

Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.
