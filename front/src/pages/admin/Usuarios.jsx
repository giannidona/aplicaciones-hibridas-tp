import { useEffect, useState } from "react";
import { call } from "../../services/api.service";
import { useUsuario } from "../../context/session.context";

export default function Usuarios() {
  const usuario = useUsuario();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    call("/users")
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const handleCambiarRol = async (id, rol) => {
    try {
      await call(`/users/${id}/rol`, "PATCH", { rol });
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, rol } : u)),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

    try {
      await call(`/users/${id}`, "DELETE");
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) return <p className="p-8 text-center">Cargando usuarios...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand">Usuarios</h1>

      {usuarios.length === 0 ? (
        <p className="text-center text-gray-500">No hay usuarios cargados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                // Comparamos por email (y no por _id) porque el login no
                // devuelve el _id del usuario, solo email/name/rol/token.
                const esYoMismo = u.email === usuario?.email;

                return (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.rol}
                        disabled={esYoMismo}
                        onChange={(e) => handleCambiarRol(u._id, e.target.value)}
                        className="rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-accent disabled:opacity-50"
                        title={esYoMismo ? "No podés cambiar tu propio rol" : ""}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEliminar(u._id)}
                        disabled={esYoMismo}
                        title={esYoMismo ? "No podés eliminar tu propia cuenta" : ""}
                        className="text-red-600 disabled:opacity-40"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
