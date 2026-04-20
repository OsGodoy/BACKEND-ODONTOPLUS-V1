import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { ROLES } from "../constants/roles.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError("No autorizado", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401));
    }

    return next(new AppError("Token inválido", 401));
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Sin autorización", 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Sin autorización", 403));
    }

    next();
  };
};

export const isOwnerOrAdmin = (paramName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autenticado", 401));
    }

    const userId = req.user.id;
    const paramId = req.params[paramName];
    const isAdmin = req.user.roles?.includes(ROLES.ADMIN);

    if (String(userId) === String(paramId) || isAdmin) {
      return next();
    }

    return next(
      new AppError("No tienes permisos para acceder a este recurso", 403),
    );
  };
};

export const verifyTokenOptional = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
};
