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
router.patch(
  "/api/users/:id/rol",
  [validateToken, validateRol(["admin"])],
  userController.updateUserRol,
);
router.delete(
  "/api/users/:id",
  [validateToken, validateRol(["admin"])],
  userController.deleteUser,
);

export default router;
