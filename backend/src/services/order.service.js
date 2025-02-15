import { Op } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { Order, Book, User, Category } from "../models/index.js";
import { badRequest, conflict, forbidden, notFoundError } from "../lib/errors.js";
import { paginate, paged } from "../lib/pagination.js";

const includes = [
  {
    model: Book,
    as: "book",
    attributes: ["id", "title", "author", "coverUrl", "price", "amount"],
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  },
  { model: User, as: "user", attributes: ["id", "fullname", "username"] },
];

export const myOrders = (user) =>
  Order.findAll({ where: { userId: user.id }, include: includes, order: [["createdAt", "DESC"]] });

export const createOrder = async (user, { bookId, amount, note }) => {
  const book = await Book.findByPk(bookId);
  if (!book || !book.status) throw notFoundError("Kitob topilmadi");
  if (book.amount < amount) throw badRequest(`Omborda faqat ${book.amount} dona mavjud`);
  const existing = await Order.findOne({ where: { userId: user.id, bookId, status: "pending" } });
  if (existing) throw conflict("Bu kitobga buyurtmangiz ko'rib chiqilmoqda");
  const order = await Order.create({ userId: user.id, bookId, amount, note });
  return order.reload({ include: includes });
};

export const cancelOrder = async (user, id) => {
  const order = await Order.findByPk(id);
  if (!order || order.userId !== user.id) throw notFoundError("Buyurtma topilmadi");
  if (order.status !== "pending") throw forbidden("Faqat kutilayotgan buyurtmani bekor qilish mumkin");
  await order.destroy();
};

export const listOrders = async (query) => {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.search) {
    where[Op.or] = [
      { "$book.title$": { [Op.iLike]: `%${query.search}%` } },
      { "$user.username$": { [Op.iLike]: `%${query.search}%` } },
      { "$user.fullname$": { [Op.iLike]: `%${query.search}%` } },
    ];
  }
  const result = await Order.findAndCountAll({
    where,
    include: includes,
    order: [["createdAt", "DESC"]],
    ...paginate(query),
    distinct: true,
    subQuery: false,
  });
  return paged(result, query);
};

/** Admin buyurtma holatini o'zgartiradi; qabul qilinganda ombordan ayiriladi */
export const setOrderStatus = async (id, status) =>
  sequelize.transaction(async (transaction) => {
    const order = await Order.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!order) throw notFoundError("Buyurtma topilmadi");
    if (order.status === status) return order.reload({ include: includes, transaction });

    const book = await Book.findByPk(order.bookId, { transaction, lock: transaction.LOCK.UPDATE });

    if (status === "accepted") {
      if (book.amount < order.amount) throw badRequest(`Omborda faqat ${book.amount} dona mavjud`);
      await book.decrement("amount", { by: order.amount, transaction });
    } else if (order.status === "accepted") {
      await book.increment("amount", { by: order.amount, transaction });
    }

    order.status = status;
    await order.save({ transaction });
    return order.reload({ include: includes, transaction });
  });
