import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const ROLES = ["user", "admin", "superadmin"];

export class User extends Model {
  toJSON() {
    const { passwordHash, ...rest } = this.get({ plain: true });
    return rest;
  }
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullname: { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(300), allowNull: false },
    role: { type: DataTypes.ENUM(...ROLES), allowNull: false, defaultValue: "user" },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "User", tableName: "users" },
);
