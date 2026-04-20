import { createSecretary } from "../repositories/secretaryRepository.js";
import bcrypt from "bcrypt";

export const createSecretaryService = async (data) => {
  const { name, email, password } = data;

  const passwordHash = await bcrypt.hash(password, 10);

  return await createSecretary({
    name,
    email,
    passwordHash,
  });
};
