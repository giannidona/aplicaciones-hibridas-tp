import { Router } from "express";
import * as userController from "../controllers/users.controller.js";
import { validateUser } from "../../middlewares/users.validate.js";
import { validateToken, validateRol } from "../../middlewares/auth.validate.js";

const router = Router();

router.get(
  "/api/users",
  [validateToken, validateRol(["admin"])],
  userController.getUsers,
);
router.post("/api/users", [validateUser], userController.saveUser);
router.post("/api/login", userController.loginUser);

export default router;
