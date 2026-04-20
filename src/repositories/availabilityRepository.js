import { pool } from "../config/postgreDatabase.js";

export const createAvailability = async ({
  doctor_id,
  day_of_week,
  start_time,
  end_time,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO availability (doctor_id, day_of_week, start_time, end_time)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [doctor_id, day_of_week, start_time, end_time],
  );

  return rows[0];
};

export const getAvailableDoctors = async (date, startTime, endTime) => {
  const dayOfWeek = new Date(date).getUTCDay();

  const query = `
    SELECT 
      d.id, 
      d.specialty,
      json_build_object('id', u.id, 'name', u.name) as user
    FROM doctors d
    INNER JOIN users u ON d.user_id = u.id
    INNER JOIN availability av ON d.id = av.doctor_id
    WHERE av.day_of_week = $1
      AND av.start_time <= $2
      AND av.end_time >= $3
      AND NOT EXISTS (
        SELECT 1 FROM appointments ap
        WHERE ap.doctor_id = d.id
          AND ap.date = $4
          AND ap.status != 'cancelled'
          AND ap.deleted_at IS NULL
          AND ((ap.start_time, ap.end_time) OVERLAPS ($2::time, $3::time))
      );
  `;
  const { rows } = await pool.query(query, [
    dayOfWeek,
    startTime,
    endTime,
    date,
  ]);
  return rows;
};

export const getAvailabilityByDoctor = async (doctorId) => {
  const { rows } = await pool.query(
    `SELECT *
    FROM availability
    WHERE doctor_id = $1
    ORDER BY day_of_week, start_time
    `,
    [doctorId],
  );

  return rows;
};
