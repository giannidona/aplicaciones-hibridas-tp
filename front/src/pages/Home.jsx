import { useEffect, useState } from "react";
import { Link } from "react-router";
import { call } from "../services/api.service";

export default function Home() {
  const [categorias, setCategorias] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      call("/categories").catch(() => []),
      call("/products?isFeatured=true").catch(() => []),
    ]).then(([categoriesData, featuredData]) => {
      setCategorias(categoriesData);
      setDestacados(featuredData);
      setCargando(false);
    });
  }, []);

  return (
    <div>
      <section className="bg-[#1f1a2e] px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Sadona</h1>
        <p className="mt-3 text-gray-300">
          Belleza y cuidado personal, todo en un mismo lugar.
        </p>
        <Link
          to="/productos"
          className="mt-6 inline-block rounded-lg bg-[#a06cd5] px-6 py-2.5 font-medium text-white"
        >
          Ver todos los productos
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold text-[#1f1a2e]">Categorías</h2>

        {!cargando && categorias.length === 0 && (
          <p className="text-gray-500">Todavía no hay categorías cargadas.</p>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categorias.map((c) => (
            <Link
              key={c._id}
              to={`/productos?categoryId=${c._id}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-700 transition-colors hover:border-[#a06cd5] hover:text-[#a06cd5]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-4 text-xl font-bold text-[#1f1a2e]">Destacados</h2>

        {cargando && <p className="text-gray-500">Cargando destacados...</p>}

        {!cargando && destacados.length === 0 && (
          <p className="text-gray-500">
            Todavía no hay productos destacados. Marcá uno como destacado
            desde "Editar producto" para que aparezca acá.
          </p>
        )}

        {!cargando && destacados.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {destacados.map((p) => (
              <Link
                key={p._id}
                to={`/productos/${p._id}`}
                className="overflow-hidden rounded-xl bg-white shadow"
              >
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
