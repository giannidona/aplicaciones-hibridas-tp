import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { call } from "../../services/api.service";
import { useUsuario } from "../../context/session.context";
import ProductCard from "../../components/ProductCard";

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [inputBusqueda, setInputBusqueda] = useState(search);
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
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
  // el fetch, para no hacer un request por cada tecla. Al buscar, volvemos
  // siempre a la pagina 1 (si estabas en la pagina 3 y cambiás el filtro,
  // no tendría sentido quedarte ahí).
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search: inputBusqueda, page: "" });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputBusqueda]);

  useEffect(() => {
    setCargando(true);
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    call(`/products?${params.toString()}`)
      .then((data) => {
        setProductos(data.items ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [categoryId, search, sort, page]);

  const handleCategoriaChange = (value) => {
    updateParams({ categoryId: value, page: "" });
  };

  const handleOrdenChange = (e) => {
    updateParams({ sort: e.target.value, page: "" });
  };

  const handlePaginaChange = (nuevaPagina) => {
    updateParams({ page: String(nuevaPagina) });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <h1 className="mb-6 text-2xl font-bold text-brand">Productos</h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-48">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Categorías
          </h2>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1">
            <button
              onClick={() => handleCategoriaChange("")}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                categoryId === ""
                  ? "bg-brand font-medium text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCategoriaChange(c._id)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  categoryId === c._id
                    ? "bg-brand font-medium text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-sm">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.11 6.11a7.5 7.5 0 0 0 10.54 10.54Z" />
              </svg>
              <input
                type="text"
                value={inputBusqueda}
                onChange={(e) => setInputBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-accent"
              />
            </div>

            <select
              value={sort}
              onChange={handleOrdenChange}
              className="h-10 shrink-0 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-accent sm:w-56"
            >
              <option value="">Ordenar por...</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name_asc">Nombre: A-Z</option>
              <option value="name_desc">Nombre: Z-A</option>
            </select>
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
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {productos.map((p) => (
                <ProductCard
                  key={p._id}
                  producto={p}
                  esAdmin={esAdmin}
                  onEliminar={handleEliminar}
                />
              ))}
            </div>
          )}

          {!cargando && !error && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePaginaChange(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => handlePaginaChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
