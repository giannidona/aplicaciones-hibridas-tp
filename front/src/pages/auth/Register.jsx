import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersSchema } from "../../schemas/user.schema";
import { call } from "../../services/api.service";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(usersSchema) });

  const onSubmit = async (datos) => {
    try {
      await call("/users", "POST", datos);
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-bold text-[#1f1a2e]">Crear cuenta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a06cd5]"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#1f1a2e] py-2 font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-[#a06cd5]">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
