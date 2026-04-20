import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createSecretarySchema } from "../validators/secretaryValidator.js";
import { createSecretaryController } from "../controllers/secretaryController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// protegidas
router.use(authenticate, authorize(ROLES.ADMIN));

router.post(
  "/",
  validateRequest(createSecretarySchema),
  createSecretaryController,
);

export default router;
