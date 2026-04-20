import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getAppointmentsByDoctorAndDate,
  deleteAppointment,
  updateAppointment,
  getAppointmentsByDoctorId,
  getAppointmentsByPatientId,
} from "../repositories/appointmentRepository.js";

import { getAvailabilityByDoctor } from "../repositories/availabilityRepository.js";
import { getDoctorById } from "../repositories/doctorsRepository.js";
import { getPatientById } from "../repositories/patientRepository.js";
import { AppError } from "../utils/AppError.js";

export const createAppointmentService = async (data) => {
  const { doctor_id, patient_id, date, start_time, end_time } = data;

  // 🔥 0. validar paciente existe
  const patient = await getPatientById(patient_id);

  if (!patient) {
    throw new AppError("El paciente no existe", 400);
  }

  // 🔥 1. validar disponibilidad (lo que ya tienes)
  const availability = await getAvailabilityByDoctor(doctor_id);

  const [year, month, day] = date.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();

  const availableThatDay = availability.filter(
    (slot) => slot.day_of_week === dayOfWeek,
  );

  if (!availableThatDay.length) {
    throw new AppError("El doctor no atiende ese día", 400);
  }

  // 🔥 2. validar horario dentro del rango
  const isInside = availableThatDay.some((slot) => {
    return start_time >= slot.start_time && end_time <= slot.end_time;
  });

  if (!isInside) {
    throw new AppError("Horario fuera de disponibilidad", 400);
  }

  // 🔥 3. evitar solapamientos (ya lo tienes)
  const existingAppointments = await getAppointmentsByDoctorAndDate(
    doctor_id,
    date,
  );

  const isOverlapping = existingAppointments.some((appt) => {
    return start_time < appt.end_time && end_time > appt.start_time;
  });

  if (isOverlapping) {
    throw new AppError("Horario no disponible", 400);
  }

  return await createAppointment(data);
};

export const updateAppointmentService = async (id, data) => {
  const existing = await getAppointmentById(id);

  if (!existing) {
    throw new AppError("Cita no encontrada", 400);
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No hay datos para actualizar", 400);
  }

  if (data.start_time || data.end_time || data.date) {
    const doctor_id = data.doctor_id || existing.doctor_id;
    const date = data.date || existing.date;
    const start_time = data.start_time || existing.start_time;
    const end_time = data.end_time || existing.end_time;

    const appointments = await getAppointmentsByDoctorAndDate(doctor_id, date);

    const isOverlapping = appointments.some((appt) => {
      if (appt.id === id) return false;

      return start_time < appt.end_time && end_time > appt.start_time;
    });

    if (isOverlapping) {
      throw new AppError("Horario no disponible", 400);
    }
  }

  return await updateAppointment(id, data);
};

export const getAppointmentsService = async ({ search }) => {
  return await getAppointments({ search });
};

export const getAppointmentByIdService = async (id) => {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    throw new AppError("Cita no encontrada", 400);
  }

  return appointment;
};

export const appointmentStatusService = async (id, status) => {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    throw new AppError("Cita no encontrada", 400);
  }

  if (appointment.status === "cancelled") {
    throw new AppError("No puedes modificar una cita cancelada", 400);
  }

  return await updateAppointment(id, { status });
};

export const deleteAppointmentService = async (id) => {
  const appointment = await deleteAppointment(id);
  if (!appointment) {
    throw new AppError("El registro no existe o ya fue eliminado", 400);
  }
  return appointment;
};

export const getAppointmentsByDoctorIdService = async ({
  doctorId,
  date,
  status,
  page,
  limit,
}) => {
  const doctor = await getDoctorById(doctorId);

  if (!doctor) {
    throw new AppError("Doctor no encontrado", 400);
  }

  return await getAppointmentsByDoctorId({
    doctorId,
    date,
    status,
    page,
    limit,
  });
};

export const getAppointmentsByPatientIdService = async ({
  patientId,
  date,
  status,
  page,
  limit,
}) => {
  const patient = await getPatientById(patientId);

  if (!patient) {
    throw new AppError("Paciente no encontrado", 400);
  }

  return await getAppointmentsByPatientId({
    patientId,
    date,
    status,
    page,
    limit,
  });
};
