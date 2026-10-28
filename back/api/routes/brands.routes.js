import { Router } from "express";
import * as brandController from "../controllers/brands.controller.js";
import { validateToken, validateRol } from "../../middlewares/auth.validate.js";

const router = Router();

router.get("/api/brands", brandController.getBrands);
router.get("/api/brands/:id", brandController.getBrandById);
router.post("/api/brands", [validateToken, validateRol(["admin"])], brandController.saveBrand);
router.put("/api/brands/:id", [validateToken, validateRol(["admin"])], brandController.editBrand);
router.delete("/api/brands/:id", [validateToken, validateRol(["admin"])], brandController.deleteBrand);
router.get("/api/brands/:id/products", brandController.getProductsByBrand);

export default router;
