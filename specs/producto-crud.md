# Spec: completar el CRUD de productos en el frontend

## Fase 1 — Exploración (resumen)

- Backend ya completo y protegido: `back/api/routes/products.routes.js:9` (`POST /api/products`) y `:10` (`PUT /api/products/:id`), ambos con `[validateToken, validateRol(["admin"])]`.
- `back/services/products.services.js:27-31` (`saveProduct`) y `:33-36` (`editProduct`) guardan el body tal cual llega, sin validar — no existe un schema de Zod para productos (solo `back/schemas/users.schema.js`).
- Frontend: `front/src/pages/productos/NuevoProducto.jsx` y `EditarProducto.jsx` son placeholders ("en construcción").
- `front/src/pages/productos/Productos.jsx` ya linkea a `/editar-producto/:id` (solo si `esAdmin`). `ProductoDetalle.jsx` ya tiene botón "Editar" al mismo lugar.
- `front/src/main.jsx` ya protege `/nuevo-producto` y `/editar-producto/:id` con `<ProtectedRoute rol={["admin"]} />`.
- `front/src/services/api.service.js` (`call`) ya adjunta `Authorization: Bearer` leyendo la sesión.
- `front/src/context/session.context.jsx` expone `useUsuario()` para saber el rol.
- Combos necesarios: `GET /api/brands` y `GET /api/categories` devuelven listas completas, alcanza para poblar los `<select>`.
- Modelo de producto (inferido de `ProductoDetalle.jsx` y de los filtros en `products.services.js`): `{ _id, name, description, price, stock, images: [{url}], brandId, categoryId, isFeatured }`.

## Entregas

| # | Nombre | Qué agrega | Estado |
|---|---|---|---|
| E1 | Crear producto | Formulario en `NuevoProducto.jsx` con `react-hook-form` que arma el `POST /api/products` y redirige a `/productos` al guardar | entregada |
| E2 | Editar producto | Formulario en `EditarProducto.jsx` que precarga `GET /products/:id` y hace `PUT /api/products/:id` | pendiente |

## Casos a verificar por entrega

**E1**
- Admin logueado crea un producto con todos los campos → 201, aparece en `/productos`.
- Un usuario no-admin no puede ni ver `/nuevo-producto` (ya lo bloquea `ProtectedRoute`, se vuelve a confirmar).
- Si falta un campo requerido, el form muestra el error y no llega a mandar el `POST`.

**E2**
- Admin edita un producto existente → `PUT` 202, el cambio se ve reflejado en `/productos` y en `/productos/:id`.
- El formulario precarga los valores actuales del producto al entrar.

## Nota sobre tests automáticos

No hay test runner instalado (ni Jest ni Vitest) en `back/` ni `front/`, y el PDF del Parcial 2 no pide tests automatizados. La verificación de cada entrega (Fase 4/6) se hace con Thunder Client + prueba manual en el navegador, no con un test suite. Instalar tests reales queda fuera del alcance de esta spec; es una mejora aparte si en algún momento se quiere sumar.
