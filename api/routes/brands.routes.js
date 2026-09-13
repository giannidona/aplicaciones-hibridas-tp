import { Router } from "express";
import * as brandController from "../controllers/brands.controller.js";

const router = Router();

router.get("/api/brands", brandController.getBrands);
router.post("/api/brands", brandController.saveBrand);
router.put("/api/brands/:id", brandController.editBrand);
router.delete("/api/brands/:id", brandController.deleteBrand);
router.get("/api/brands/:id/products", brandController.getProductsByBrand);

export default router;
