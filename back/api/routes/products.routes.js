import { Router } from "express";
import * as productController from "../controllers/products.controller.js";

const router = Router();

router.get("/api/products", productController.getProducts);
router.get("/api/products/:id", productController.getProductById);
router.post("/api/products", productController.saveProduct);
router.put("/api/products/:id", productController.editProduct);
router.delete("/api/products/:id", productController.deleteProduct);

export default router;
