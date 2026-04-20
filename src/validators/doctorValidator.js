import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener mínimo 2 caracteres");

const emailSchema = z.string().trim().email("Email inválido");

const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener mínimo 6 caracteres");

const specialtySchema = z
  .string()
  .trim()
  .min(2, "La especialidad debe tener mínimo 2 caracteres")
  .optional();

const uuidSchema = z.string().uuid("ID inválido");

export const getDoctorsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    ids: z.string().optional(),
  }),
});

export const createDoctorSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    specialty: specialtySchema,
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    specialty: specialtySchema,
  }),
});

export const getDoctorByIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
