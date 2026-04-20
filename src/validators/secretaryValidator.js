import { z } from "zod";

export const createSecretarySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "El nombre debe tener mínimo 2 caracteres"),

    email: z.string().trim().email("Email inválido"),

    password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
  }),
});
