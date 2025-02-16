import { Router } from "express";
import { Book, Category, Order, User } from "../models/index.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

export const statsRouter = Router();

/** Ochiq statistika — asosiy sahifa uchun */
statsRouter.get("/", async (_req, res) => {
  const [books, categories, readers, delivered] = await Promise.all([
    Book.count({ where: { status: true } }),
    Category.count(),
    User.count({ where: { role: "user" } }),
    Order.count({ where: { status: "accepted" } }),
  ]);
  res.json({ books, categories, readers, delivered });
});

/** Admin dashboard statistikasi */
statsRouter.get("/admin", authenticate, requireAdmin, async (_req, res) => {
  const [books, inactiveBooks, categories, users, pending, accepted, rejected, recentOrders, topBooks] =
    await Promise.all([
      Book.count(),
      Book.count({ where: { status: false } }),
      Category.count(),
      User.count(),
      Order.count({ where: { status: "pending" } }),
      Order.count({ where: { status: "accepted" } }),
      Order.count({ where: { status: "rejected" } }),
      Order.findAll({
        limit: 6,
        order: [["createdAt", "DESC"]],
        include: [
          { model: Book, as: "book", attributes: ["id", "title", "coverUrl"] },
          { model: User, as: "user", attributes: ["id", "fullname", "username"] },
        ],
      }),
      Book.findAll({ limit: 5, order: [["views", "DESC"]], attributes: ["id", "title", "author", "views", "coverUrl"] }),
    ]);
  res.json({
    books,
    inactiveBooks,
    categories,
    users,
    orders: { pending, accepted, rejected, total: pending + accepted + rejected },
    recentOrders,
    topBooks,
  });
});
