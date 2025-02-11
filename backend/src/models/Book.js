import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Book extends Model {}

Book.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    author: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    year: { type: DataTypes.INTEGER, allowNull: true },
    pages: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    coverUrl: { type: DataTypes.STRING(300), allowNull: true },
    fileUrl: { type: DataTypes.STRING(300), allowNull: true },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    categoryId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: "Book", tableName: "books" },
);
