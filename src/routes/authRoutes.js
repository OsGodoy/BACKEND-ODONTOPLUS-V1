import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema } from "../validators/authValidator.js";
import {
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/authController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), loginController);

router.post("/logout", logoutController);

router.post("/refresh", refreshTokenController);

router.get("/me", getMeController);

export default router;
