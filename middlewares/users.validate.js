import { usersSchema } from "../schemas/users.schema.js";

export async function validateUser(req, res, next) {
  try {
    await usersSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos", errors: error.issues });
  }
}
