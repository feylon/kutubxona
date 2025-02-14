import { Op } from "sequelize";
import { Book, Category } from "../models/index.js";
import { notFoundError } from "../lib/errors.js";
import { paginate, paged } from "../lib/pagination.js";
import { removeUploaded } from "../lib/upload.js";

const withCategory = { include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }] };

export const listBooks = async (query, { includeInactive = false } = {}) => {
  const { search, categoryId, sort, available } = query;
  const where = {};
  if (!includeInactive) where.status = true;
  if (categoryId) where.categoryId = categoryId;
  if (available) where.amount = { [Op.gt]: 0 };
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const order = {
    newest: [["createdAt", "DESC"]],
    popular: [["views", "DESC"], ["createdAt", "DESC"]],
    title: [["title", "ASC"]],
    price_asc: [["price", "ASC"]],
    price_desc: [["price", "DESC"]],
  }[sort ?? "newest"];

  const result = await Book.findAndCountAll({ where, order, ...paginate(query), ...withCategory });
  return paged(result, query);
};

export const getBook = async (id, { includeInactive = false } = {}) => {
  const book = await Book.findByPk(id, withCategory);
  if (!book || (!includeInactive && !book.status)) throw notFoundError("Kitob topilmadi");
  return book;
};

export const viewBook = async (id) => {
  const book = await getBook(id);
  await book.increment("views");
  return book.reload(withCategory);
};

export const topBooks = (limit = 8) =>
  Book.findAll({ where: { status: true }, order: [["views", "DESC"]], limit, ...withCategory });

export const latestBooks = (limit = 8) =>
  Book.findAll({ where: { status: true }, order: [["createdAt", "DESC"]], limit, ...withCategory });

export const createBook = async (data) => {
  const book = await Book.create(data);
  return book.reload(withCategory);
};

export const updateBook = async (id, data) => {
  const book = await getBook(id, { includeInactive: true });
  await book.update(data);
  return book.reload(withCategory);
};

export const deleteBook = async (id) => {
  const book = await getBook(id, { includeInactive: true });
  await book.destroy();
  removeUploaded(book.coverUrl);
  removeUploaded(book.fileUrl);
  return book;
};
