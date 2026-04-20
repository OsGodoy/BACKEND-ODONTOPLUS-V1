import {
  findUserByEmail,
  getUserById,
} from "../repositories/authRepository.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/handleTokens.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken(user.id);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await getUserById(decoded.id);

  if (user.rows.length === 0) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const accessToken = signAccessToken({
    id: user.rows[0].id,
    role: user.rows[0].role,
  });

  return { accessToken };
};

export const getMeService = async (userId) => {
  const result = await getUserById(userId);

  if (result.rows.length === 0) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return result.rows[0];
};
