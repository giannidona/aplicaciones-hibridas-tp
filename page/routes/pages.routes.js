import { Router } from "express";
import {
  renderHome,
  renderCategoryPage,
} from "../controllers/pages.controller.js";

const router = Router();

router.get("/", renderHome);
router.get("/categorias/:id", renderCategoryPage);

export default router;
