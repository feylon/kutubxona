import { Sequelize } from "sequelize";
import { config } from "../config.js";

export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  logging: false,
  define: { underscored: true, timestamps: true },
  pool: { max: 10, min: 0, idle: 10_000 },
});
