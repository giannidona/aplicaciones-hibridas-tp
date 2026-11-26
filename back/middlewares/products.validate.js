import { productsSchema } from "../schemas/products.schema.js";

export async function validateProduct(req, res, next) {
  try {
    req.body = await productsSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos", errors: error.issues });
  }
}
