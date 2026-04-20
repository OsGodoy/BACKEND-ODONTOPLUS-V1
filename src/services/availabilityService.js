import { validate } from "uuid";
import {
  createAvailability,
  getAvailabilityByDoctor,
  getAvailableDoctors,
} from "../repositories/availabilityRepository.js";
import { AppError } from "../utils/AppError.js";

export const createAvailabilityService = async (data) => {
  return await createAvailability(data);
};

export const getAvailableDoctorsService = async (date, startTime, endTime) => {
  return await getAvailableDoctors(date, startTime, endTime);
};

export const getAvailabilityService = async (doctorId) => {
  if (!validate(doctorId)) {
    throw new AppError("ID inválido", 400);
  }
  return await getAvailabilityByDoctor(doctorId);
};
