import { Navigate } from "react-router";
import { useUsuario } from "../context/session.context";

export default function ProtectedRoute({ element, rol }) {
  const usuario = useUsuario();
  if (usuario && rol.includes(usuario.rol)) return element;
  if (usuario) return <Navigate to="/productos" />;
  return <Navigate to="/login" />;
}
