import { User, ROLES } from "./User.js";
import { Category } from "./Category.js";
import { Book } from "./Book.js";
import { Order, ORDER_STATUSES } from "./Order.js";

Category.hasMany(Book, { foreignKey: "categoryId", as: "books" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Book.hasMany(Order, { foreignKey: "bookId", as: "orders" });
Order.belongsTo(Book, { foreignKey: "bookId", as: "book" });

export { User, Category, Book, Order, ROLES, ORDER_STATUSES };
