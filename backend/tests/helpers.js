import { Sequelize } from "sequelize";

const TEST_DB = "kutubxona_test";
const base = process.env.DATABASE_URL ?? "postgresql://kutubxona:kutubxona@127.0.0.1:5433/kutubxona";
const testUrl = base.replace(/\/[^/]+$/, `/${TEST_DB}`);

/** Test bazasini yaratadi (mavjud bo'lmasa) va DATABASE_URL ni unga yo'naltiradi */
export const prepareTestDatabase = async () => {
  const admin = new Sequelize(base, { dialect: "postgres", logging: false });
  const [rows] = await admin.query(`SELECT 1 FROM pg_database WHERE datname = '${TEST_DB}'`);
  if (rows.length === 0) await admin.query(`CREATE DATABASE ${TEST_DB}`);
  await admin.close();
  process.env.DATABASE_URL = testUrl;
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET ??= "test-secret";
};

export const startApp = async () => {
  const { app } = await import("../src/app.js");
  const { sequelize } = await import("../src/db/index.js");
  await sequelize.sync({ force: true });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const url = `http://127.0.0.1:${server.address().port}/api`;
  const api = async (method, path, { body, token, form } = {}) => {
    const headers = {};
    if (token) headers.authorization = `Bearer ${token}`;
    if (body && !form) headers["content-type"] = "application/json";
    const res = await fetch(url + path, { method, headers, body: form ?? (body ? JSON.stringify(body) : undefined) });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { status: res.status, data };
  };
  const close = async () => {
    await new Promise((r) => server.close(r));
    await sequelize.close();
  };
  return { api, close, sequelize };
};

export const seedStaff = async (sequelize) => {
  const { User } = await import("../src/models/index.js");
  const { hashPassword } = await import("../src/lib/password.js");
  const { signToken } = await import("../src/lib/jwt.js");
  const superadmin = await User.create({ fullname: "Super Admin", username: "superadmin", passwordHash: hashPassword("Admin123!"), role: "superadmin" });
  const admin = await User.create({ fullname: "Admin", username: "admin", passwordHash: hashPassword("Admin123!"), role: "admin" });
  void sequelize;
  return { superadmin, admin, superToken: signToken(superadmin), adminToken: signToken(admin) };
};
