import { User } from "../models/index.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signToken } from "../lib/jwt.js";
import { conflict, forbidden, unauthorized } from "../lib/errors.js";

export const register = async ({ fullname, username, password }) => {
  const exists = await User.findOne({ where: { username } });
  if (exists) throw conflict("Bu foydalanuvchi nomi band");
  const user = await User.create({ fullname, username, passwordHash: hashPassword(password) });
  return { user, token: signToken(user) };
};

export const login = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw unauthorized("Login yoki parol noto'g'ri");
  }
  if (!user.status) throw forbidden("Hisobingiz bloklangan");
  return { user, token: signToken(user) };
};

export const changePassword = async (user, { currentPassword, newPassword }) => {
  if (!verifyPassword(currentPassword, user.passwordHash)) {
    throw unauthorized("Joriy parol noto'g'ri");
  }
  user.passwordHash = hashPassword(newPassword);
  await user.save();
};

export const updateProfile = async (user, { fullname }) => {
  user.fullname = fullname;
  await user.save();
  return user;
};
