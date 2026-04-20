import { pool } from "../config/postgreDatabase.js";
import { createUser } from "./userRepository.js";

export const getDoctors = async ({ search, ids } = {}) => {
  const values = [];
  const filters = [];

  let baseQuery = `SELECT 
      d.*,

      -- USER (info del doctor)
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'role', u.role
      ) AS user,

      -- AVAILABILITY
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', av.id,
            'day_of_week', av.day_of_week,
            'start_time', av.start_time,
            'end_time', av.end_time
          )
        ) FILTER (WHERE av.id IS NOT NULL),
        '[]'
      ) AS availability

    FROM doctors d
    LEFT JOIN users u ON u.id = d.user_id
    LEFT JOIN availability av ON av.doctor_id = d.id
  `;

  filters.push(`d.deleted_at IS NULL`);
  filters.push(`u.deleted_at IS NULL`);

  if (ids && ids.length > 0) {
    filters.push(`d.id = ANY($${values.length + 1}::uuid[])`);
    values.push(ids);
  } else {
    if (search) {
      values.push(`%${search}%`);
      filters.push(`
        (
          u.name ILIKE $${values.length}
          OR u.email ILIKE $${values.length}
          OR d.specialty ILIKE $${values.length}
        )
      `);
    }
  }

  if (filters.length > 0) {
    baseQuery += ` WHERE ${filters.join(" AND ")}`;
  }

  baseQuery += `
    GROUP BY d.id, u.id
    ORDER BY u.name ASC
  `;

  const { rows } = await pool.query(baseQuery, values);

  return rows;
};

export const getDoctorById = async (id) => {
  const { rows } = await pool.query(
    `SELECT 
      d.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      ) AS user,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', av.id,
            'day_of_week', av.day_of_week,
            'start_time', av.start_time,
            'end_time', av.end_time
          )
        ) FILTER (WHERE av.id IS NOT NULL),
        '[]'
      ) AS availability
    FROM doctors d
    LEFT JOIN users u ON u.id = d.user_id
    LEFT JOIN availability av ON av.doctor_id = d.id
    WHERE d.id = $1 AND d.deleted_at IS NULL
    GROUP BY d.id, u.id
    `,
    [id],
  );

  return rows[0] || null;
};

export const createDoctor = async ({
  name,
  email,
  passwordHash,
  specialty,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔥 1. crear usuario reutilizando función global
    const user = await createUser(client, {
      name,
      email,
      passwordHash,
      role: "doctor",
    });

    // 🔥 2. crear doctor
    const doctorResult = await client.query(
      `INSERT INTO doctors (user_id, specialty)
       VALUES ($1, $2)
       RETURNING *`,
      [user.id, specialty],
    );

    await client.query("COMMIT");

    return {
      ...doctorResult.rows[0],
      user,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
