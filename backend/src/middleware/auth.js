import { verifyToken } from "../lib/jwt.js";
import { forbidden, unauthorized } from "../lib/errors.js";
import { User } from "../models/index.js";

const extractToken = (req) => {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token ? token : null;
};

/** Tokenni tekshiradi va req.user ni to'ldiradi */
export const authenticate = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next(unauthorized());
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(unauthorized("Token yaroqsiz yoki muddati tugagan"));
  }
  const user = await User.findByPk(payload.sub);
  if (!user) return next(unauthorized("Foydalanuvchi topilmadi"));
  if (!user.status) return next(forbidden("Hisobingiz bloklangan"));
  req.user = user;
  next();
};

/** Token bo'lsa req.user ni to'ldiradi, bo'lmasa ham o'tkazib yuboradi */
export const optionalAuth = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.sub);
    if (user?.status) req.user = user;
  } catch {
    /* anonim foydalanuvchi */
  }
  next();
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (!roles.includes(req.user.role)) return next(forbidden());
  next();
};

export const requireAdmin = requireRole("admin", "superadmin");
export const requireSuperAdmin = requireRole("superadmin");
