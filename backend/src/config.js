import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`.env faylida ${name} ko'rsatilmagan`);
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 4100),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  uploadsDir: path.resolve(__dirname, "../uploads"),
  isTest: process.env.NODE_ENV === "test",
};
