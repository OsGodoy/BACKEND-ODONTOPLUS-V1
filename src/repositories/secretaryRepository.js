import { pool } from "../config/postgreDatabase.js";
import { createUser } from "../repositories/userRepository.js";

export const createSecretary = async ({ name, email, passwordHash }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user = await createUser(client, {
      name,
      email,
      passwordHash,
      role: "secretary",
    });

    const secretaryResult = await client.query(
      `INSERT INTO secretaries (user_id)
       VALUES ($1)
       RETURNING *`,
      [user.id],
    );

    await client.query("COMMIT");

    return {
      ...secretaryResult.rows[0],
      user,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
