import { Navigate } from "react-router";

export default function ProtectedRoute({ element, rol }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && rol.includes(usuario.rol)) return element;
  if (usuario) return <Navigate to="/productos" />;
  return <Navigate to="/login" />;
}
