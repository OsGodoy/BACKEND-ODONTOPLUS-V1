import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const keyGenerator = (req) => {
  if (req.user?.id) return `user-${req.user.id}`;
  return `ip-${ipKeyGenerator(req)}`;
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: (req) => req.path.startsWith("/image"),
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => ipKeyGenerator(req),
});

export const imageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  keyGenerator,
});