import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Category extends Model {}

Category.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  },
  { sequelize, modelName: "Category", tableName: "categories" },
);
