import { Op } from "sequelize";
import { User, Order } from "../models/index.js";
import { forbidden, notFoundError } from "../lib/errors.js";
import { hashPassword } from "../lib/password.js";
import { paginate, paged } from "../lib/pagination.js";

export const listUsers = async (query) => {
  const where = {};
  if (query.role) where.role = query.role;
  if (query.search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${query.search}%` } },
      { fullname: { [Op.iLike]: `%${query.search}%` } },
    ];
  }
  const result = await User.findAndCountAll({ where, order: [["createdAt", "DESC"]], ...paginate(query) });
  return paged(result, query);
};

const findUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw notFoundError("Foydalanuvchi topilmadi");
  return user;
};

/** Admin oddiy foydalanuvchini, superadmin esa hammani (o'zidan tashqari) bloklay oladi */
export const setStatus = async (actor, id, status) => {
  const user = await findUser(id);
  if (user.id === actor.id) throw forbidden("O'zingizni bloklay olmaysiz");
  if (actor.role !== "superadmin" && user.role !== "user") throw forbidden("Faqat superadmin adminlarni boshqaradi");
  user.status = status;
  await user.save();
  return user;
};

export const setRole = async (actor, id, role) => {
  const user = await findUser(id);
  if (user.id === actor.id) throw forbidden("O'z rolingizni o'zgartira olmaysiz");
  user.role = role;
  await user.save();
  return user;
};

export const createStaff = async ({ fullname, username, password, role }) =>
  User.create({ fullname, username, passwordHash: hashPassword(password), role });

export const userOrders = (id) =>
  Order.findAll({ where: { userId: id }, order: [["createdAt", "DESC"]] });
