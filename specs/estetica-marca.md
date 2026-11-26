# Spec: mejorar la estética de marca en el Home y las cards de producto

## Fase 1 — Exploración (resumen)

- Los colores de marca (`#1f1a2e` oscuro, `#a06cd5` acento) están hardcodeados
  como hex sueltos: 49 repeticiones en 8 archivos (`Nav.jsx`, `Login.jsx`,
  `Register.jsx`, `NuevoProducto.jsx`, `EditarProducto.jsx`, `Productos.jsx`,
  `ProductoDetalle.jsx`, `Home.jsx`). No hay un lugar único que los defina.
- `front/src/index.css` no define tipografía propia, usa el stack de
  sistema (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) — no
  hay una fuente que le dé identidad a la marca.
- La tarjeta de producto está duplicada: `Home.jsx` (sección "Destacados") y
  `Productos.jsx` (grilla principal) tienen casi el mismo JSX de card
  copiado y pegado en los dos archivos, en vez de un componente compartido.
- Las cards no tienen hover/transición, ni ningún indicador visual de que
  un producto está destacado (el campo `isFeatured` existe en el modelo
  pero no se refleja visualmente en ningún lado todavía).

## Entregas

| # | Nombre | Qué agrega | Estado |
|---|---|---|---|
| E1 | Tokens de marca | Colores y tipografía centralizados con `@theme` en `index.css` (Tailwind v4); reemplazo de los hex hardcodeados por clases semánticas (`bg-brand`, `text-brand`, `bg-accent`, etc.) en los 8 archivos que los usan | entregada |
| E2 | Componente `ProductCard` compartido | Se extrae la tarjeta de producto duplicada en `Home.jsx` y `Productos.jsx` a `front/src/components/ProductCard.jsx`, con hover/transición y un badge visual cuando `isFeatured` es `true` | entregada |
| E3 | Polish del Home | Ajustes visuales del hero y de los accesos directos a categorías para que usen el mismo lenguaje (tokens + tipografía) que las cards ya rediseñadas | entregada |

## Casos a verificar por entrega

**E1**
- La app se ve visualmente igual (mismos colores) pero ahora viene de clases de Tailwind, no de hex sueltos.
- Cambiar un color en un solo lugar (`index.css`) se refleja en toda la app.

**E2**
- `Home.jsx` y `Productos.jsx` usan el mismo `<ProductCard />`, sin JSX de tarjeta duplicado.
- Un producto con `isFeatured: true` muestra el badge; uno sin destacar, no.
- El hover (sombra/escala sutil) funciona en ambas páginas igual.

**E3**
- El hero del Home y los accesos a categorías usan los mismos tokens de color/tipografía que las cards.

## Nota sobre tests automáticos

Igual que en las specs anteriores: no hay test runner instalado, la
verificación es visual/manual en el navegador.
