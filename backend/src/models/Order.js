import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const ORDER_STATUSES = ["pending", "accepted", "rejected"];

export class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    amount: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    status: { type: DataTypes.ENUM(...ORDER_STATUSES), allowNull: false, defaultValue: "pending" },
    note: { type: DataTypes.STRING(300), allowNull: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    bookId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: "Order", tableName: "orders" },
);
