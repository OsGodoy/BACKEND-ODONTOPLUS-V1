import { z } from "zod";

const uuidSchema = z.string().uuid("ID inválido");

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Hora inválida");

const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), "Fecha inválida");

const statusSchema = z.enum(["pending", "confirmed", "cancelled"]).optional();

const pageSchema = z.coerce.number().min(1).optional();
z.coerce.number().min(1).optional();

const limitSchema = z.coerce.number().min(1).max(100).optional();

export const createAppointmentSchema = z.object({
  body: z
    .object({
      doctor_id: uuidSchema,
      patient_id: uuidSchema,

      date: z.string(),
      start_time: timeSchema,
      end_time: timeSchema,

      notes: z.string().optional(),
    })
    .refine((data) => data.start_time < data.end_time, {
      message: "La hora de inicio debe ser menor que la de fin",
      path: ["end_time"],
    }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z
    .object({
      doctor_id: uuidSchema.optional(),
      patient_id: uuidSchema.optional(),
      date: dateSchema.optional(),
      start_time: timeSchema.optional(),
      end_time: timeSchema.optional(),
      notes: z.string().optional(),
      status: statusSchema,
    })
    .refine(
      (data) => {
        if (!data.start_time || !data.end_time) return true;
        return data.start_time < data.end_time;
      },
      {
        message: "La hora de inicio debe ser menor que la de fin",
        path: ["end_time"],
      },
    ),
});

export const getAppointmentSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const getAppointmentsByDoctorSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),

  query: z.object({
    date: z.string().date().optional(),
    status: statusSchema,

    page: pageSchema,
    limit: limitSchema,
  }),
});

export const getAppointmentsByPatientSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),

  query: z.object({
    date: z.string().date().optional(),
    status: statusSchema,

    page: pageSchema,
    limit: limitSchema,
  }),
});

export const appointmentStatusSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    status: statusSchema,
  }),
});
