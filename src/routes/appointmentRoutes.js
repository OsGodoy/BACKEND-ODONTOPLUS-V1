import { Router } from "express";
import {
  appointmentStatusController,
  createAppointmentController,
  deleteAppointmentController,
  getAppointmentByIdController,
  getAppointmentsByDoctorIdController,
  getAppointmentsByPatientIdController,
  getAppointmentsController,
  updateAppointmentController,
} from "../controllers/appointmentController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  appointmentStatusSchema,
  createAppointmentSchema,
  getAppointmentsByDoctorSchema,
  getAppointmentsByPatientSchema,
  getAppointmentSchema,
  updateAppointmentSchema,
} from "../validators/appointmentValidator.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
const router = Router();

router.get("/", getAppointmentsController);

router.post(
  "/",
  validateRequest(createAppointmentSchema),
  createAppointmentController,
);

router.get(
  "/:id",
  validateRequest(getAppointmentSchema),
  getAppointmentByIdController,
);

router.patch(
  "/:id",
  validateRequest(updateAppointmentSchema),
  updateAppointmentController,
);

router.get(
  "/doctor/:id",
  validateRequest(getAppointmentsByDoctorSchema),
  getAppointmentsByDoctorIdController,
);

router.get(
  "/patient/:id",
  validateRequest(getAppointmentsByPatientSchema),
  getAppointmentsByPatientIdController,
);

// status routes

router.patch(
  "/:id/status",
  validateRequest(appointmentStatusSchema),
  appointmentStatusController,
);

// protegidas
router.use(authenticate, authorize(ROLES.ADMIN));

router.delete("/:id", deleteAppointmentController);

export default router;
