import { pool } from "../config/postgreDatabase.js";

export const createPatient = async ({ name, phone, email, document_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO patients (name, phone, email, document_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, phone || null, email || null, document_id || null],
  );

  return rows[0];
};

export const getPatients = async () => {
  const { rows } = await pool.query(
    `SELECT *
     FROM patients
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC`,
  );

  return rows;
};

export const getPatientById = async (id) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM patients
     WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );

  return rows[0];
};

export const updatePatient = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  if (!fields.length) return null;

  const { rows } = await pool.query(
    `UPDATE patients
     SET ${fields.join(", ")}
     WHERE id = $${index}
     RETURNING *`,
    [...values, id],
  );

  return rows[0];
};

export const deletePatient = async (id) => {
  const { rows } = await pool.query(
    `UPDATE patients
     SET deleted_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return rows[0];
};

export const getPatientByEmailOrDocument = async (email, document_id) => {
  const conditions = [];
  const values = [];
  let index = 1;

  if (email) {
    conditions.push(`email = $${index}`);
    values.push(email);
    index++;
  }

  if (document_id) {
    conditions.push(`document_id = $${index}`);
    values.push(document_id);
    index++;
  }

  if (!conditions.length) return null;

  const { rows } = await pool.query(
    `SELECT *
     FROM patients
     WHERE (${conditions.join(" OR ")})
     AND deleted_at IS NULL
     LIMIT 1`,
    values,
  );

  return rows[0];
};
