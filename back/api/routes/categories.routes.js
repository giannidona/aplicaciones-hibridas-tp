import { Router } from "express";
import * as categoryController from "../controllers/categories.controller.js";
import { validateToken, validateRol } from "../../middlewares/auth.validate.js";

const router = Router();

router.get("/api/categories", categoryController.getCategories);
router.post("/api/categories", [validateToken, validateRol(["admin"])], categoryController.saveCategory);
router.put("/api/categories/:id", [validateToken, validateRol(["admin"])], categoryController.editCategory);
router.delete("/api/categories/:id", [validateToken, validateRol(["admin"])], categoryController.deleteCategory);
router.get("/api/categories/:id/products", categoryController.getProductsByCategory);

export default router;
