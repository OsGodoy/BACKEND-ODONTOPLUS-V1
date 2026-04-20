import { z } from "zod";

const uuidSchema = z.string().uuid("ID inválido");

const dayOfWeekSchema = z
  .number()
  .int()
  .min(0, "Debe ser entre 0 y 6")
  .max(6, "Debe ser entre 0 y 6");

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Hora inválida");

export const createAvailabilitySchema = z.object({
  body: z
    .object({
      doctor_id: uuidSchema,
      day_of_week: dayOfWeekSchema,
      start_time: timeSchema,
      end_time: timeSchema,
    })
    .refine((data) => data.start_time < data.end_time, {
      message: "La hora de inicio debe ser menor que la de fin",
      path: ["end_time"],
    }),
});

export const getAvailabilitySchema = z.object({
  params: z.object({
    doctorId: uuidSchema,
  }),
});

export const getAvailableDoctorsSchema = z.object({
  query: z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha inválida"),
    start_time: timeSchema,
    end_time: timeSchema,
  }).refine((data) => data.start_time < data.end_time, {
    message: "La hora de inicio debe ser menor que la de fin",
    path: ["end_time"],
  }),
});