import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Logout from "./pages/auth/Logout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Productos = lazy(() => import("./pages/productos/Productos.jsx"));
const ProductoDetalle = lazy(
  () => import("./pages/productos/ProductoDetalle.jsx"),
);
const NuevoProducto = lazy(() => import("./pages/productos/NuevoProducto.jsx"));
const EditarProducto = lazy(
  () => import("./pages/productos/EditarProducto.jsx"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <Home />
          </Suspense>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/registro", element: <Register /> },
      { path: "/logout", element: <Logout /> },
      {
        path: "/productos",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <ProtectedRoute
              element={<Productos />}
              rol={["customer", "admin"]}
            />
          </Suspense>
        ),
      },
      {
        path: "/productos/:id",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <ProtectedRoute
              element={<ProductoDetalle />}
              rol={["customer", "admin"]}
            />
          </Suspense>
        ),
      },
      {
        path: "/nuevo-producto",
        element: <ProtectedRoute element={<NuevoProducto />} rol={["admin"]} />,
      },
      {
        path: "/editar-producto/:id",
        element: (
          <ProtectedRoute element={<EditarProducto />} rol={["admin"]} />
        ),
      },
      { path: "*", element: <div>404 — página no encontrada</div> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
