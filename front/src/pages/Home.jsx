import { useEffect, useState } from "react";
import { Link } from "react-router";
import { call } from "../services/api.service";
import ProductCard from "../components/ProductCard";

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
      <section className="bg-brand px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Sadona</h1>
        <p className="mt-3 text-gray-300">
          Belleza y cuidado personal, todo en un mismo lugar.
        </p>
        <Link
          to="/productos"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          Ver todos los productos
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold text-brand">Categorías</h2>

        {!cargando && categorias.length === 0 && (
          <p className="text-gray-500">Todavía no hay categorías cargadas.</p>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categorias.map((c) => (
            <Link
              key={c._id}
              to={`/productos?categoryId=${c._id}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-4 text-xl font-bold text-brand">Destacados</h2>

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
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
