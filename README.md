# Sadona

Proyecto fullstack MERN para la materia Aplicaciones Híbridas (Parcial 2). Es
un e-commerce de productos de belleza y cuidado personal: catálogo con
filtros y búsqueda, autenticación de usuarios con JWT, y gestión de
productos para usuarios administradores.

Reutiliza y extiende el backend armado en el Parcial 1 (mismo dataset real
de productos, marcas y categorías), sumando autenticación, roles, y todo el
frontend en React.

## Stack

**Backend** (`back/`): Node.js + Express, MongoDB (driver nativo, sin
Mongoose), JWT (`jsonwebtoken`) para autenticación, `bcrypt` para hashear
contraseñas, `zod` para validación de datos, arquitectura en capas
(`routes` → `controllers` → `services`).

**Frontend** (`front/`): React 19 + Vite, `react-router` (rutas públicas y
protegidas por rol), `react-hook-form` + `zod` para validación de
formularios, Context API (`SessionProvider`) para el estado de sesión,
Tailwind CSS v4.

## Estructura

```
tp/
├── back/      API REST (puerto 3333)
├── front/     SPA de React (Vite, puerto 5173 por defecto)
├── specs/     Specs de las funcionalidades agregadas sobre el Parcial 1
└── AGENTS.md  Metodología de trabajo con agentes de IA usada en el proyecto
```

## Variables de entorno

El backend necesita un archivo `back/.env` (no se sube al repositorio) con:

```
MONGO_URI=
JWT_SECRET=
```

El `.env` con los valores reales se entrega aparte, como pide la consigna
(nunca van en el README ni en ningún archivo versionado en git).

## Instalación y ejecución

Requiere Node.js y `pnpm` instalados (`npm install -g pnpm` si no lo tenés).

**Backend**

```bash
cd back
pnpm install
pnpm approve-builds   # necesario una vez, por el build nativo de bcrypt
pnpm run dev
```

Queda escuchando en `http://localhost:3333`.

**Frontend** (en otra terminal)

```bash
cd front
pnpm install
pnpm run dev
```

Queda disponible en `http://localhost:5173`. Con el backend corriendo en el
puerto 3333, la app ya consume la API sin configuración adicional.

## Funcionalidades implementadas

- Registro y login con contraseñas encriptadas (`bcrypt`), sesión con JWT.
- Roles `customer` / `admin`: las mutaciones (crear, editar, borrar
  productos) están protegidas tanto en el frontend (`ProtectedRoute`) como
  en el backend (`validateToken` + `validateRol`), que es la protección que
  realmente importa.
- Catálogo de productos público: listado, detalle, filtro por categoría,
  búsqueda en vivo por nombre o marca (sin apretar Enter).
- CRUD completo de productos para administradores (alta, edición, borrado).
- Home con productos destacados y accesos directos por categoría.
- Resolución de la marca de un producto con `$lookup` de MongoDB (una sola
  consulta a la base, en vez de dos llamadas encadenadas) — ver
  `specs/producto-detalle-lookup.md`.

## Cómo probar como administrador

Los registros nuevos desde el formulario del frontend siempre se crean con
rol `customer`. Para probar las funciones de admin hay dos opciones:

1. Registrar un usuario incluyendo `"rol": "admin"` en el body del POST
   directo a `/api/users` (por ejemplo desde Thunder Client), en vez de
   usar el formulario de `/registro`.
2. Registrar un usuario normal y después editar manualmente el campo `rol`
   a `"admin"` en el documento del usuario, desde el Data Explorer de
   MongoDB Atlas.

Ya hay un usuario admin cargado en la base para probar directo, sin tener
que crear uno nuevo:

- **Email:** `admin@sadona.com`
- **Contraseña:** `Admin123!`

Con esa cuenta logueada aparece el link "Nuevo producto" en el nav, y los
botones de "Editar"/"Borrar" en las cards y el detalle de cada producto.

## Metodología de trabajo

Este proyecto siguió el flujo de trabajo con agentes de IA en fases
(`AGENTS.md`, provisto por la cátedra): cada funcionalidad nueva se
especificó en `specs/<funcionalidad>.md`, partida en entregas chicas, antes
de escribir el código.
