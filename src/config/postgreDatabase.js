import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000,
});

export const pgConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("CONECTADO A LA DB POSTGRESQL");
    client.release();
  } catch (error) {
    console.error("--- Error: ---", error.message);
  }
};
