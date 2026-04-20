import jwt from "jsonwebtoken";

export const signAccessToken = ({ id, role }) => {
  const payload = {
    id,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRES_IN || "15m",
  });
};

export const signRefreshToken = (userId) => {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
  });
};
