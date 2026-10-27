import { Router } from "express";
import {
  renderHome,
  renderCategoryPage,
  renderProductPage,
} from "../controllers/pages.controller.js";

const router = Router();

router.get("/", renderHome);
router.get("/categorias/:id", renderCategoryPage);
router.get("/productos/:id", renderProductPage);

export default router;
