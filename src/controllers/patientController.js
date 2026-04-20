import {
  createPatientService,
  getPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
} from "../services/patientService.js";

export const createPatientController = async (req, res, next) => {
  try {
    const patient = await createPatientService(req.validated.body);

    res.status(201).json({
      message: "Paciente creado",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientsController = async (req, res, next) => {
  try {
    const data = await getPatientsService();

    res.status(200).json({
      message: "Pacientes obtenidos",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientByIdController = async (req, res, next) => {
  try {
    const data = await getPatientByIdService(req.validated.params.id);

    res.status(200).json({
      message: "Paciente obtenido",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePatientController = async (req, res, next) => {
  try {
    const data = await updatePatientService(
      req.validated.params.id,
      req.validated.body,
    );

    res.status(200).json({
      message: "Paciente actualizado",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatientController = async (req, res, next) => {
  try {
    const data = await deletePatientService(req.validated.params.id);

    res.status(200).json({
      message: "Paciente eliminado",
      data,
    });
  } catch (error) {
    next(error);
  }
};
