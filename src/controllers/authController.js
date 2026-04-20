import {
  getMeService,
  loginService,
  refreshTokenService,
} from "../services/authService.js";
import {
  clearAccessCookie,
  clearRefreshCookie,
  setAccessCookie,
  setRefreshCookie,
} from "../utils/handleCookies.js";

export const loginController = async (req, res, next) => {
  try {
    const result = await loginService(req.validated.body);

    setAccessCookie(res, result.accessToken);
    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      message: "Sesión iniciada",
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = (req, res) => {
  clearAccessCookie(res);
  clearRefreshCookie(res);

  return res.status(200).json({
    message: "Sesión cerrada correctamente",
    data: null,
  });
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const { accessToken } = await refreshTokenService(req.cookies.refreshToken);

    setAccessCookie(res, accessToken);

    res.status(200).json({
      message: "Token refrescado correctamente",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const user = await getMeService(req.user.id);

    res.status(200).json({
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
