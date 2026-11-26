import { Link } from "react-router";
import { useUsuario } from "../context/session.context";

export default function Nav() {
  const usuario = useUsuario();

  return (
    <nav className="flex items-center justify-between bg-brand px-6 py-4 text-white">
      <Link to="/" className="text-xl font-bold">
        Sadona
      </Link>
      <div className="flex gap-4 text-sm">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        {usuario?.rol === "admin" && (
          <Link to="/nuevo-producto">Nuevo producto</Link>
        )}
        {!usuario && <Link to="/login">Login</Link>}
        {!usuario && <Link to="/registro">Registro</Link>}
        {usuario && <Link to="/logout">Salir</Link>}
      </div>
    </nav>
  );
}
