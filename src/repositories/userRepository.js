import { AppError } from "../utils/AppError.js";

// 🔥 create user reutilizable
export const createUser = async (
  client,
  { name, email, passwordHash, role },
) => {
  // 1. validar email único
  const existingUser = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError("El email ya está registrado", 400);
  }

  // 2. insertar usuario
  const result = await client.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, passwordHash, role],
  );

  return result.rows[0];
};
