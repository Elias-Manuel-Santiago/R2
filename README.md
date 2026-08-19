# Lista de tareas

Trabajo práctico desarrollado con Vite, TypeScript, React Compiler, React 19 y React Router.

## Funcionalidades

- Inicio con listado de tareas.
- Detalle accesible desde cada tarjeta.
- Formulario para crear tareas completas o incompletas.
- Persistencia de las tareas creadas en `localStorage`.
- Modo claro y oscuro.
- Diseño responsive para escritorio, tablet y celular.
- Página 404 para direcciones o tareas inexistentes.

## Comandos

```bash
npm install
npm run dev
```

Para comprobar el proyecto antes de entregarlo:

```bash
npm run lint
npm run build
```

## Organización

- `src/components`: piezas reutilizables y sus estilos.
- `src/pages`: cada página y sus estilos.
- `src/context`: estado compartido y lógica de tareas.
- `src/data`: tareas iniciales de ejemplo.
- `src/types`: modelos de TypeScript.
- `src/utils`: funciones auxiliares sencillas.
