import { Sequelize } from "sequelize";
import { Category, Book } from "../models/index.js";
import { conflict, notFoundError } from "../lib/errors.js";
import { slugify } from "../lib/slug.js";

export const listCategories = () =>
  Category.findAll({
    attributes: {
      include: [[Sequelize.fn("COUNT", Sequelize.col("books.id")), "bookCount"]],
    },
    include: [{ model: Book, as: "books", attributes: [], where: { status: true }, required: false }],
    group: ["Category.id"],
    order: [["name", "ASC"]],
  });

export const getCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw notFoundError("Kategoriya topilmadi");
  return category;
};

export const createCategory = async ({ name }) => {
  const slug = slugify(name);
  if (await Category.findOne({ where: { slug } })) throw conflict("Bunday kategoriya mavjud");
  return Category.create({ name, slug });
};

export const updateCategory = async (id, { name }) => {
  const category = await getCategory(id);
  category.name = name;
  category.slug = slugify(name);
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await getCategory(id);
  const count = await Book.count({ where: { categoryId: id } });
  if (count > 0) throw conflict(`Bu kategoriyada ${count} ta kitob bor, avval ularni ko'chiring`);
  await category.destroy();
};
