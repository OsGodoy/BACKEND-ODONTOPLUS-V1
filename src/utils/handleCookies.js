const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const setAccessCookie = (res, token) => {
  res.cookie("accessToken", token, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });
};

export const clearAccessCookie = (res) => {
  res.clearCookie("accessToken", baseCookieOptions);
};

export const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", baseCookieOptions);
};
