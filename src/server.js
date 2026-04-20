import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import doctorsRoutes from "./routes/doctorsRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import secretaryRoutes from "./routes/secretaryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { handleErrors } from "./utils/handleErrors.js";
import { pgConnection, pool } from "./config/postgreDatabase.js";
import { verifyTokenOptional } from "./middlewares/authMiddleware.js";
import { authLimiter, globalLimiter } from "./utils/rateLimiter.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(verifyTokenOptional);

app.use(globalLimiter);

app.use("/auth", authLimiter, authRoutes);

app.use("/doctors", doctorsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/secretary", secretaryRoutes);

app.use(handleErrors);

await pgConnection();

const server = app.listen(PORT, () => {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
});

let shuttingDown = false;

const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\nRecibido ${signal}. Cerrando aplicación...`);

  try {
    await new Promise((resolve) => server.close(resolve));
    console.log("Servidor HTTP cerrado");

    await pool.end();
    console.log("PostgreSQL cerrado");

    console.log("Cierre limpio completado");
    process.exit(0);
  } catch (error) {
    console.error("Error durante el cierre:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
  shutdown("unhandledRejection");
});
