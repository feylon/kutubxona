import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { prepareTestDatabase, startApp } from "./helpers.js";

let ctx;
before(async () => {
  await prepareTestDatabase();
  ctx = await startApp();
});
after(() => ctx.close());

test("ro'yxatdan o'tish token qaytaradi va parolni yashiradi", async () => {
  const res = await ctx.api("POST", "/auth/register", { body: { fullname: "Ali Valiyev", username: "ali", password: "secret12" } });
  assert.equal(res.status, 201);
  assert.ok(res.data.token);
  assert.equal(res.data.user.role, "user");
  assert.equal(res.data.user.passwordHash, undefined);
});

test("bir xil username bilan qayta ro'yxatdan o'tib bo'lmaydi", async () => {
  const res = await ctx.api("POST", "/auth/register", { body: { fullname: "Ali Valiyev", username: "ali", password: "secret12" } });
  assert.equal(res.status, 409);
});

test("validatsiya xatolari 400 va tafsilotlar bilan qaytadi", async () => {
  const res = await ctx.api("POST", "/auth/register", { body: { fullname: "A", username: "x", password: "1" } });
  assert.equal(res.status, 400);
  assert.ok(Array.isArray(res.data.details));
  assert.ok(res.data.details.some((d) => d.path === "password"));
});

test("kirish: to'g'ri va noto'g'ri parol", async () => {
  const ok = await ctx.api("POST", "/auth/login", { body: { username: "ali", password: "secret12" } });
  assert.equal(ok.status, 200);
  const bad = await ctx.api("POST", "/auth/login", { body: { username: "ali", password: "wrong!" } });
  assert.equal(bad.status, 401);
});

test("/auth/me tokensiz 401, token bilan foydalanuvchini qaytaradi", async () => {
  const anon = await ctx.api("GET", "/auth/me");
  assert.equal(anon.status, 401);
  const { data } = await ctx.api("POST", "/auth/login", { body: { username: "ali", password: "secret12" } });
  const me = await ctx.api("GET", "/auth/me", { token: data.token });
  assert.equal(me.status, 200);
  assert.equal(me.data.user.username, "ali");
});

test("parolni o'zgartirish", async () => {
  const { data } = await ctx.api("POST", "/auth/login", { body: { username: "ali", password: "secret12" } });
  const res = await ctx.api("POST", "/auth/change-password", { token: data.token, body: { currentPassword: "secret12", newPassword: "newpass99" } });
  assert.equal(res.status, 200);
  const relogin = await ctx.api("POST", "/auth/login", { body: { username: "ali", password: "newpass99" } });
  assert.equal(relogin.status, 200);
});
