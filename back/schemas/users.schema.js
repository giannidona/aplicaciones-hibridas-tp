import { z } from "zod";

export const usersSchema = z
  .object({
    name: z
      .string("El nombre es requerido")
      .min(3, "El nombre debe tener como mínimo 3 caracteres"),
    email: z.email("El correo tiene que ser válido"),
    password: z
      .string("El password es requerido")
      .min(8, "Como mínimo debe tener 8 caracteres")
      .regex(/[A-Z]/, "Debe tener una mayúscula")
      .regex(/[a-z]/, "Debe tener una minúscula")
      .regex(/[0-9]/, "Debe tener números")
      .regex(
        /[@_.,!"·$%&/(=)]/,
        'Debe tener un carácter especial @_.,!"·$%&/(=)',
      ),
    confirmPassword: z.string(
      "El campo confirmación de password es obligatorio",
    ),
    rol: z.enum(["customer", "admin"]).default("customer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
