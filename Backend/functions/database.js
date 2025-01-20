import pkg from "pg";
import { configDotenv } from "dotenv";
const { Pool } = pkg;
configDotenv();
const { connectionString } = process.env;
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool