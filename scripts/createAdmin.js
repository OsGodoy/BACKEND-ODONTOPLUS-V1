import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../src/config/postgreDatabase.js";

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Faltan variables de entorno para el admin");
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      ADMIN_EMAIL,
    ]);

    if (existing.rows.length > 0) {
      console.log("Admin ya existe");
      return process.exit(0);
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      [ADMIN_NAME || "Admin", ADMIN_EMAIL, passwordHash],
    );

    console.log("Admin creado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error creando admin:", error);
    process.exit(1);
  }
};

createAdmin();
