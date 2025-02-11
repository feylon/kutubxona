import { sequelize } from "./sequelize.js";
import "../models/index.js";

export const connectDatabase = async ({ sync = true } = {}) => {
  await sequelize.authenticate();
  if (sync) await sequelize.sync();
  console.log("🗄️  Ma'lumotlar bazasi ulandi");
  return sequelize;
};

export { sequelize };
