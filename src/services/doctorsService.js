import {
  createDoctor,
  getDoctorById,
  getDoctors,
} from "../repositories/doctorsRepository.js";
import { validate } from "uuid";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";

export const getDoctorsService = async ({ search, ids }) => {
  let parsedIds = null;

  if (ids) {
    parsedIds = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  return await getDoctors({
    search,
    ids: parsedIds,
  });
};

export const getDoctorByIdService = async (id) => {
  if (!validate(id)) {
    throw new AppError("ID inválido", 400);
  }

  const doctor = await getDoctorById(id);

  if (!doctor) {
    throw new AppError("Doctor no encontrado", 404);
  }

  return doctor;
};

export const createDoctorService = async (data) => {
  const { name, email, password, specialty } = data;

  const passwordHash = await bcrypt.hash(password, 10);

  return await createDoctor({
    name,
    email,
    passwordHash,
    specialty,
  });
};
