# Corrección del profesor: resolver la marca con $lookup en vez de 2 llamadas

## Contexto

Al mostrar el detalle de un producto (`/productos/:id`), el frontend hacía dos
llamadas encadenadas: una a `GET /products/:id` y, si el producto tenía
`brandId`, una segunda a `GET /brands/:id` para traer el nombre de la marca.

El profesor corrigió esto en una consulta: aunque MongoDB es NoSQL y no tiene
`JOIN` como SQL, el framework de agregación sí tiene `$lookup`, que resuelve
un join del lado del servidor en una sola consulta a la base. La corrección
fue: en vez de 2 viajes de ida y vuelta (uno del cliente al back, y adentro
del back otro a Mongo para la marca), se puede traer el producto con la marca
ya resuelta en una sola consulta.

## Qué se cambió

- `back/services/products.services.js` (`getProductById`): pasó de un
  `findOne` pelado a un `aggregate` con `$match` + `$lookup` (de `brands`,
  por `brandId` → `_id`) + `$unwind` (con `preserveNullAndEmptyArrays: true`
  para que productos sin marca no rompan). El documento que devuelve ahora
  trae `producto.brand` embebido.
- `front/src/pages/productos/ProductoDetalle.jsx`: se sacó el segundo
  `call('/brands/:id')` y el estado `brand` aparte; ahora lee directamente
  `producto.brand` de la única respuesta de `GET /products/:id`.
