import { Router } from "express";
import {
  createDoctorController,
  getDoctorByIdController,
  getDoctorsController,
} from "../controllers/doctorsController.js";
import {
  createDoctorSchema,
  getDoctorByIdSchema,
  getDoctorsSchema,
} from "../validators/doctorValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", validateRequest(getDoctorsSchema), getDoctorsController);

router.get(
  "/:id",
  validateRequest(getDoctorByIdSchema),
  getDoctorByIdController,
);

// protegidas
router.use(authenticate, authorize(ROLES.ADMIN));

router.post("/", validateRequest(createDoctorSchema), createDoctorController);

export default router;
