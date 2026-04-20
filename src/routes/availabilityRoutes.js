import { Router } from "express";
import {
  createAvailabilityController,
  getAvailabilityController,
  getAvailableDoctorsController,
} from "../controllers/availabilityController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createAvailabilitySchema,
  getAvailabilitySchema,
  getAvailableDoctorsSchema,
} from "../validators/availabilityValidator.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get(
  "/available-doctors",
  validateRequest(getAvailableDoctorsSchema),
  getAvailableDoctorsController,
);

router.get(
  "/:doctorId",
  validateRequest(getAvailabilitySchema),
  getAvailabilityController,
);

// protegidas
router.use(authenticate, authorize(ROLES.ADMIN));

router.post(
  "/",
  validateRequest(createAvailabilitySchema),
  createAvailabilityController,
);

export default router;
