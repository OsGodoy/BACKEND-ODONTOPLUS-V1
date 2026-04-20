import { z } from "zod";

const uuidSchema = z.string().uuid("ID inválido");

export const createPatientSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Nombre muy corto").max(100),

    phone: z.string().max(20).optional(),

    email: z.string().email("Email inválido").optional(),

    document_id: z.string().max(50).optional(),
  }),
});

export const updatePatientSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional(),
    email: z.string().email().optional(),
    document_id: z.string().max(50).optional(),
  }),
});

export const getPatientSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
