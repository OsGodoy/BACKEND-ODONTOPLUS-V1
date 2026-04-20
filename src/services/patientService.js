import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientByEmailOrDocument,
} from "../repositories/patientRepository.js";
import { AppError } from "../utils/AppError.js";

export const createPatientService = async (data) => {
  const existing = await getPatientByEmailOrDocument(
    data.email,
    data.document_id,
  );

  if (existing) {
    throw new AppError("Paciente ya existe", 404);
  }

  return await createPatient(data);
};

export const getPatientsService = async () => {
  return await getPatients();
};

export const getPatientByIdService = async (id) => {
  const patient = await getPatientById(id);

  if (!patient) {
    throw new AppError("Paciente no encontrado", 404);
  }

  return patient;
};

export const updatePatientService = async (id, data) => {
  const existing = await getPatientById(id);

  if (!existing) {
    throw new AppError("Paciente no encontrado", 404);
  }

  const updated = await updatePatient(id, data);

  return updated;
};

export const deletePatientService = async (id) => {
  const existing = await getPatientById(id);

  if (!existing) {
    throw new AppError("Paciente no encontrado", 404);
  }

  return await deletePatient(id);
};
