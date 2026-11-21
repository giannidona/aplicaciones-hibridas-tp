import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { call } from "../../services/api.service";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    Promise.all([
      call("/brands").catch(() => []),
      call("/categories").catch(() => []),
      call(`/products/${id}`),
    ])
      .then(([brandsData, categoriesData, producto]) => {
        setMarcas(brandsData);
        setCategorias(categoriesData);
        reset({
          name: producto.name,
          description: producto.description,
          price: producto.price,
          stock: producto.stock,
          brandId: producto.brandId || "",
          categoryId: producto.categoryId || "",
          isFeatured: producto.isFeatured || false,
          imageUrl: producto.images?.[0]?.url || "",
        });
      })
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargando(false));
  }, [id, reset]);

  const onSubmit = async (datos) => {
    setErrorGeneral("");
    try {
      const producto = {
        name: datos.name,
        description: datos.description,
        price: Number(datos.price),
        stock: Number(datos.stock),
        brandId: datos.brandId || null,
        categoryId: datos.categoryId || null,
        isFeatured: datos.isFeatured,
        images: datos.imageUrl ? [{ url: datos.imageUrl }] : [],
      };
      await call(`/products/${id}`, "PUT", producto);
      navigate(`/productos/${id}`);
    } catch (err) {
      setErrorGeneral(err.message);
    }
  };

  if (cargando) return <p className="p-8 text-center">Cargando...</p>;
  if (errorCarga) return <p className="p-8 text-center text-red-600">{errorCarga}</p>;

  return (
    <div className="mx-auto mt-10 max-w-xl px-4 pb-16">
      <h1 className="mb-6 text-2xl font-bold text-[#1f1a2e]">Editar producto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description", { required: "La descripción es obligatoria" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Precio
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", {
                required: "El precio es obligatorio",
                min: { value: 0, message: "Tiene que ser mayor o igual a 0" },
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="stock" className="mb-1 block text-sm font-medium">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", {
                required: "El stock es obligatorio",
                min: { value: 0, message: "Tiene que ser mayor o igual a 0" },
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="brandId" className="mb-1 block text-sm font-medium">
            Marca
          </label>
          <select
            id="brandId"
            {...register("brandId")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          >
            <option value="">Sin marca</option>
            {marcas.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
            Categoría
          </label>
          <select
            id="categoryId"
            {...register("categoryId", { required: "Elegí una categoría" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          >
            <option value="">Elegí una categoría</option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">
            URL de la imagen
          </label>
          <input
            id="imageUrl"
            {...register("imageUrl")}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isFeatured")} />
          Producto destacado
        </label>

        {errorGeneral && <p className="text-sm text-red-600">{errorGeneral}</p>}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#1f1a2e] px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link
            to={`/productos/${id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
