import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { call } from "../../services/api.service";
import { useUsuario } from "../../context/session.context";

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";
  const search = searchParams.get("search") || "";

  const [inputBusqueda, setInputBusqueda] = useState(search);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const usuario = useUsuario();
  const esAdmin = usuario?.rol === "admin";

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  useEffect(() => {
    call("/categories")
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  // Debounce: espera 400ms sin tipear antes de actualizar la URL y disparar
  // el fetch, para no hacer un request por cada tecla.
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search: inputBusqueda });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputBusqueda]);

  useEffect(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (search) params.set("search", search);
    const query = params.toString() ? `?${params.toString()}` : "";

    call(`/products${query}`)
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [categoryId, search]);

  const handleCategoriaChange = (value) => {
    updateParams({ categoryId: value });
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que querés borrar este producto?")) return;

    try {
      await call(`/products/${id}`, "DELETE");
      setProductos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const hayFiltros = Boolean(categoryId || search);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#1f1a2e]">Productos</h1>

        <input
          type="text"
          value={inputBusqueda}
          onChange={(e) => setInputBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#a06cd5]"
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleCategoriaChange("")}
          className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
            categoryId === ""
              ? "border-[#1f1a2e] bg-[#1f1a2e] text-white"
              : "border-gray-300 text-gray-600 hover:border-[#a06cd5]"
          }`}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c._id}
            onClick={() => handleCategoriaChange(c._id)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
              categoryId === c._id
                ? "border-[#1f1a2e] bg-[#1f1a2e] text-white"
                : "border-gray-300 text-gray-600 hover:border-[#a06cd5]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {cargando && <p className="p-8 text-center">Cargando productos...</p>}
      {error && <p className="p-8 text-center text-red-600">{error}</p>}

      {!cargando && !error && productos.length === 0 && (
        <p className="p-8 text-center text-gray-500">
          {hayFiltros
            ? "No se encontraron productos con esos filtros."
            : "No hay productos cargados."}
        </p>
      )}

      {!cargando && !error && productos.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {productos.map((p) => (
            <div
              key={p._id}
              className="overflow-hidden rounded-xl bg-white shadow"
            >
              <Link to={`/productos/${p._id}`}>
                <img
                  src={p.images?.[0]?.url || ""}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-medium">{p.name}</h3>
                  <p className="font-bold text-[#1f1a2e]">${p.price}</p>
                </div>
              </Link>

              {esAdmin && (
                <div className="flex gap-2 border-t p-2 text-xs">
                  <Link
                    to={`/editar-producto/${p._id}`}
                    className="text-[#a06cd5]"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(p._id)}
                    className="text-red-600"
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
