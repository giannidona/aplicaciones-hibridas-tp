import { Router } from "express";
import * as productController from "../controllers/products.controller.js";
import { validateToken, validateRol } from "../../middlewares/auth.validate.js";

const router = Router();

router.get("/api/products", productController.getProducts);
router.get("/api/products/:id", productController.getProductById);
router.post("/api/products", [validateToken, validateRol(["admin"])], productController.saveProduct);
router.put("/api/products/:id", [validateToken, validateRol(["admin"])], productController.editProduct);
router.delete("/api/products/:id", [validateToken, validateRol(["admin"])], productController.deleteProduct);

export default router;
