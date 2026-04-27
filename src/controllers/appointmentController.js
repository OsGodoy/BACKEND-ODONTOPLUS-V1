import {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  deleteAppointmentService,
  updateAppointmentService,
  getAppointmentsByDoctorIdService,
  getAppointmentsByPatientIdService,
  appointmentStatusService,
} from "../services/appointmentService.js";

export const createAppointmentController = async (req, res, next) => {
  try {
    // const data = {
    //   ...req.validated.body,
    //   created_by: req.user.id,
    // };

    const appointment = await createAppointmentService(req.validated.body);

    res.status(201).json({
      message: "Cita creada",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentController = async (req, res, next) => {
  try {
    const data = await updateAppointmentService(
      req.validated.params.id,
      req.validated.body,
    );

    res.status(200).json({
      message: "Cita actualizada",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsController = async (req, res, next) => {
  try {
    const { search, status, sort } = req.validated.query;

    const data = await getAppointmentsService({ search, status, sort });

    res.status(200).json({
      message: "Citas obtenidas",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentByIdController = async (req, res, next) => {
  try {
    const data = await getAppointmentByIdService(req.validated.params.id);

    res.status(200).json({
      message: "Cita obtenida",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const appointmentStatusController = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const data = await appointmentStatusService(id, status);

    res.status(200).json({
      message: "Estado actualizado",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointmentController = async (req, res, next) => {
  try {
    await deleteAppointmentService(req.validated.params.id);

    res.status(200).json({
      message: "Cita eliminada",
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsByDoctorIdController = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { date, status, page, limit } = req.validated.query;

    const data = await getAppointmentsByDoctorIdService({
      doctorId: id,
      date,
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsByPatientIdController = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { date, status, page, limit } = req.validated.query;

    const data = await getAppointmentsByPatientIdService({
      patientId: id,
      date,
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
