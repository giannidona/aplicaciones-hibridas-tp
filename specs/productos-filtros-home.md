# Spec: filtro por categoría + búsqueda en /productos, y contenido del Home

## Fase 1 — Exploración (resumen)

- `back/services/products.services.js:3-19` (`getProducts`) ya soporta filtros
  por query string: `categoryId`, `brandId`, `isFeatured`, `price_min`/`price_max`.
  No soporta búsqueda por texto todavía.
- `back/api/controllers/products.controller.js` (`getProducts`) pasa
  `req.query` directo a `productService.getProducts(filters)` — cualquier
  filtro nuevo que agreguemos en el service ya llega solo, sin tocar el
  controller.
- `back/services/categories.services.js:5-7` (`getCategories`) ya devuelve
  la lista completa, sirve tal cual para los accesos directos del Home.
- `front/src/services/api.service.js` (`call`) concatena `BASE_URL + uri`
  tal cual se le pase — no arma query strings solo, así que el frontend
  arma el string (`?categoryId=...&search=...`) a mano.
- `front/src/pages/productos/Productos.jsx` hoy hace `call("/products")`
  sin filtros, una sola vez al montar (`useEffect(..., [])`).
- `front/src/pages/Home.jsx` es un placeholder mínimo.

## Decisión de diseño

`Productos.jsx` va a usar `useSearchParams` (de `react-router`) para leer y
escribir `categoryId` y `search` en la URL (`/productos?categoryId=X&search=Y`).
Esto permite que los accesos directos del Home (`/productos?categoryId=X`)
funcionen como links normales, y que el filtro quede en la URL (se puede
compartir o recargar sin perderlo).

## Entregas

| # | Nombre | Qué agrega | Estado |
|---|---|---|---|
| E1 | Filtro por categoría | `<select>` de categorías en `Productos.jsx`, sincronizado con `?categoryId=` en la URL vía `useSearchParams`; re-fetch al cambiar | entregada |
| E2 | Búsqueda por texto | Filtro `search` en `back/services/products.services.js`, ahora vía aggregate con `$lookup` a `brands` para matchear por `name` del producto **o** nombre de marca (`$or`); input de texto en `Productos.jsx` sincronizado con `?search=`, filtra en vivo (sin Enter) con debounce de 400ms | entregada |
| E3 | Home | Sección de productos destacados (`GET /products?isFeatured=true`) y accesos directos a categorías (`GET /categories`, cada una linkea a `/productos?categoryId=X`) | pendiente |

## Casos a verificar por entrega

**E1**
- Elegir una categoría en el select filtra la grilla y actualiza la URL.
- Entrar directo a `/productos?categoryId=X` (por ejemplo desde un link del Home) ya abre filtrado.
- Volver a "Todas las categorías" muestra el listado completo de nuevo.

**E2**
- Escribir un término que coincide con `name` de algún producto lo muestra.
- Búsqueda insensible a mayúsculas/minúsculas.
- Combinar categoría + búsqueda a la vez filtra por ambos.
- Búsqueda sin resultados muestra un mensaje, no un error.

**E3**
- El Home muestra solo los productos con `isFeatured: true` (si no hay ninguno marcado, se avisa y se explica cómo marcar uno desde `EditarProducto.jsx`, que ya tiene el checkbox).
- Cada categoría del Home linkea a `/productos?categoryId=X` y filtra correctamente al entrar.

## Nota sobre tests automáticos

Igual que en `specs/producto-crud.md`: no hay test runner instalado, la
verificación es manual (Thunder Client para el backend, navegador para el
frontend).
