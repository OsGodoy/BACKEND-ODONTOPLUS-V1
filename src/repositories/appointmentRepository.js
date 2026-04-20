import { pool } from "../config/postgreDatabase.js";

const baseAppointmentQuery = `
  SELECT
    ap.*,

    -- DOCTOR
    json_build_object(
      'id', d.id,
      'specialty', d.specialty,
      'user', json_build_object(
        'id', du.id,
        'name', du.name,
        'email', du.email
      )
    ) AS doctor,

    -- PATIENT
    json_build_object(
      'id', p.id,
      'name', p.name,
      'phone', p.phone,
      'email', p.email
    ) AS patient,

    -- CREATED BY (SECRETARIA)
    json_build_object(
      'id', cu.id,
      'name', cu.name,
      'email', cu.email,
      'role', cu.role
    ) AS created_by_user

  FROM appointments ap
  LEFT JOIN doctors d ON d.id = ap.doctor_id
  LEFT JOIN users du ON du.id = d.user_id
  LEFT JOIN patients p ON p.id = ap.patient_id
  LEFT JOIN users cu ON cu.id = ap.created_by
`;

export const createAppointment = async ({
  doctor_id,
  patient_id,
  created_by,
  date,
  start_time,
  end_time,
  notes,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO appointments 
    (doctor_id, patient_id, created_by, date, start_time, end_time, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      doctor_id,
      patient_id,
      created_by || null,
      date,
      start_time,
      end_time,
      notes || null,
    ],
  );

  return rows[0];
};

export const updateAppointment = async (id, data) => {
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
    `UPDATE appointments
     SET ${fields.join(", ")}
     WHERE id = $${index}
     RETURNING *`,
    [...values, id],
  );

  return rows[0];
};

export const getAppointments = async ({ search }) => {
  const values = [];
  const filters = ["ap.deleted_at IS NULL"];

  if (search && search.trim() !== "") {
    const searchTerm = `%${search.trim()}%`;
    const placeholder = `$${values.length + 1}`;

    filters.push(
      `(immutable_unaccent(du.name) ILIKE immutable_unaccent(${placeholder}) 
        OR immutable_unaccent(p.name) ILIKE immutable_unaccent(${placeholder}))`,
    );
    values.push(searchTerm);
  }

  const whereClause =
    filters.length > 0 ? ` WHERE ${filters.join(" AND ")}` : "";
  const orderBy = ` ORDER BY ap.date ASC, ap.start_time ASC`;

  const query = `${baseAppointmentQuery}${whereClause}${orderBy}`;

  const { rows } = await pool.query(query, values);
  return rows;
};

export const getAppointmentById = async (id) => {
  const { rows } = await pool.query(
    `
    ${baseAppointmentQuery}
    WHERE ap.id = $1 AND ap.deleted_at IS NULL
  `,
    [id],
  );

  return rows[0];
};

export const getAppointmentsByDoctorAndDate = async (doctor_id, date) => {
  const { rows } = await pool.query(
    `SELECT * FROM appointments
     WHERE doctor_id = $1 AND date = $2`,
    [doctor_id, date],
  );

  return rows;
};

export const cancelAppointment = async (id) => {
  const { rows } = await pool.query(
    `UPDATE appointments
     SET status = 'cancelled',
      deleted_at = NOW()
      WHERE id = $1
      AND status != 'cancelled'
      AND deleted_at IS NULL
     RETURNING *`,
    [id],
  );

  return rows[0];
};

export const deleteAppointment = async (id) => {
  await pool.query(
    `DELETE FROM appointments
     WHERE id = $1`,
    [id],
  );
};

export const getAppointmentsByDoctorId = async ({
  doctorId,
  date,
  status,
  page = 1,
  limit = 10,
}) => {
  const values = [];
  const filters = [];

  let query = baseAppointmentQuery;

  filters.push(`ap.deleted_at IS NULL`);
  filters.push(`ap.doctor_id = $${values.length + 1}`);
  values.push(doctorId);

  if (date) {
    filters.push(`ap.date = $${values.length + 1}`);
    values.push(date);
  }

  if (status) {
    filters.push(`ap.status = $${values.length + 1}`);
    values.push(status);
  }

  query += ` WHERE ${filters.join(" AND ")}`;

  query += `
    ORDER BY ap.date ASC, ap.start_time ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const offset = (page - 1) * limit;
  values.push(limit, offset);

  const { rows } = await pool.query(query, values);

  return rows;
};

export const getAppointmentsByPatientId = async ({
  patientId,
  date,
  status,
  page = 1,
  limit = 10,
}) => {
  const values = [];
  const filters = [];

  let query = baseAppointmentQuery;

  filters.push(`ap.deleted_at IS NULL`);
  filters.push(`ap.patient_id = $${values.length + 1}`);
  values.push(patientId);

  if (date) {
    filters.push(`ap.date = $${values.length + 1}`);
    values.push(date);
  }

  if (status) {
    filters.push(`ap.status = $${values.length + 1}`);
    values.push(status);
  }

  query += ` WHERE ${filters.join(" AND ")}`;

  query += `
    ORDER BY ap.date ASC, ap.start_time ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const offset = (page - 1) * limit;
  values.push(limit, offset);

  const { rows } = await pool.query(query, values);

  return rows;
};
