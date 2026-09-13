import { Router } from "express";
import * as categoryController from "../controllers/categories.controller.js";

const router = Router();

router.get("/api/categories", categoryController.getCategories);
router.post("/api/categories", categoryController.saveCategory);
router.put("/api/categories/:id", categoryController.editCategory);
router.delete("/api/categories/:id", categoryController.deleteCategory);
router.get(
  "/api/categories/:id/products",
  categoryController.getProductsByCategory,
);

export default router;
