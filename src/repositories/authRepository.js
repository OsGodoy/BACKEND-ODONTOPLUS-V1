import { pool } from "../config/postgreDatabase.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = $1 AND deleted_at IS NULL`,
    [email],
  );

  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      id,
      name,
      email,
      role,
      created_at
    FROM users
    WHERE id = $1 AND deleted_at IS NULL
  `,
    [id],
  );

  return result;
};
