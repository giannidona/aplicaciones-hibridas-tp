import { Link } from "react-router";

export default function ProductCard({ producto, esAdmin = false, onEliminar }) {
  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg">
      <Link to={`/productos/${producto._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={producto.images?.[0]?.url || ""}
            alt={producto.name}
            className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {producto.isFeatured && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Destacado
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-medium text-gray-800">
            {producto.name}
          </h3>
          <p className="font-bold text-brand">${producto.price}</p>
        </div>
      </Link>

      {esAdmin && (
        <div className="flex gap-2 border-t p-2 text-xs">
          <Link to={`/editar-producto/${producto._id}`} className="text-accent">
            Editar
          </Link>
          {onEliminar && (
            <button
              onClick={() => onEliminar(producto._id)}
              className="text-red-600"
            >
              Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
