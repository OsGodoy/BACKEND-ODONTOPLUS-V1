import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Ingrese un email válido")
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres");

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});
