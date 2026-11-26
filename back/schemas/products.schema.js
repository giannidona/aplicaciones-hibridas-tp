import { z } from "zod";

export const productsSchema = z.object({
  name: z.string().min(3, "El nombre debe tener como mínimo 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener como mínimo 10 caracteres"),
  price: z.number().positive("El precio tiene que ser mayor a 0"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
  brandId: z.string().nullable().optional(),
  images: z
    .array(z.object({ url: z.string().url("Tiene que ser una URL válida") }))
    .optional()
    .default([]),
  isFeatured: z.boolean().optional().default(false),
});
