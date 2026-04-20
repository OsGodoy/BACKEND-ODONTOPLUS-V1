import { Router } from "express";

import {
  createPatientController,
  getPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController,
} from "../controllers/patientController.js";

import {
  createPatientSchema,
  updatePatientSchema,
  getPatientSchema,
} from "../validators/patientValidator.js";

import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", getPatientsController);

router.get("/:id", validateRequest(getPatientSchema), getPatientByIdController);

// protegidas
router.use(authenticate, authorize(ROLES.ADMIN));

router.post("/", validateRequest(createPatientSchema), createPatientController);

router.patch(
  "/:id",
  validateRequest(updatePatientSchema),
  updatePatientController,
);

router.delete(
  "/:id",
  validateRequest(getPatientSchema),
  deletePatientController,
);

export default router;
