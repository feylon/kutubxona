import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { prepareTestDatabase, startApp, seedStaff } from "./helpers.js";

let ctx, staff, userToken, categoryId, bookId;

before(async () => {
  await prepareTestDatabase();
  ctx = await startApp();
  staff = await seedStaff(ctx.sequelize);
  const reg = await ctx.api("POST", "/auth/register", { body: { fullname: "Oddiy O'quvchi", username: "reader", password: "secret12" } });
  userToken = reg.data.token;
});
after(() => ctx.close());

test("oddiy foydalanuvchi kategoriya yarata olmaydi, admin yaratadi", async () => {
  const denied = await ctx.api("POST", "/categories", { token: userToken, body: { name: "Tarix" } });
  assert.equal(denied.status, 403);
  const ok = await ctx.api("POST", "/categories", { token: staff.adminToken, body: { name: "Tarix" } });
  assert.equal(ok.status, 201);
  assert.equal(ok.data.slug, "tarix");
  categoryId = ok.data.id;
  const dup = await ctx.api("POST", "/categories", { token: staff.adminToken, body: { name: "tarix" } });
  assert.equal(dup.status, 409);
});

test("kitob yaratish, ro'yxat, qidiruv va ko'rishlar soni", async () => {
  const created = await ctx.api("POST", "/books", {
    token: staff.adminToken,
    body: { title: "Boburnoma", author: "Bobur", categoryId, price: 50000, amount: 3, year: 1530 },
  });
  assert.equal(created.status, 201);
  bookId = created.data.id;
  assert.equal(created.data.category.name, "Tarix");

  const hidden = await ctx.api("POST", "/books", {
    token: staff.adminToken,
    body: { title: "Yashirin", author: "Nomalum", categoryId, status: false },
  });
  assert.equal(hidden.status, 201);

  const list = await ctx.api("GET", "/books?search=bobur");
  assert.equal(list.status, 200);
  assert.equal(list.data.total, 1);
  assert.equal(list.data.items[0].title, "Boburnoma");

  const publicList = await ctx.api("GET", "/books");
  assert.equal(publicList.data.total, 1, "nofaol kitob ommaga ko'rinmaydi");
  const adminList = await ctx.api("GET", "/books?all=true", { token: staff.adminToken });
  assert.equal(adminList.data.total, 2, "admin hamma kitobni ko'radi");

  await ctx.api("GET", `/books/${bookId}`);
  const detail = await ctx.api("GET", `/books/${bookId}`);
  assert.equal(detail.data.views, 2);
});

test("muqova yuklash: faqat rasm qabul qilinadi", async () => {
  const bad = new FormData();
  bad.append("cover", new Blob(["hello"], { type: "text/plain" }), "x.txt");
  const rejected = await ctx.api("POST", `/books/${bookId}/cover`, { token: staff.adminToken, form: bad });
  assert.equal(rejected.status, 400);

  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
  const good = new FormData();
  good.append("cover", new Blob([png], { type: "image/png" }), "cover.png");
  const ok = await ctx.api("POST", `/books/${bookId}/cover`, { token: staff.adminToken, form: good });
  assert.equal(ok.status, 200);
  assert.match(ok.data.coverUrl, /^\/uploads\/covers\/.+\.png$/);
});

test("buyurtma: yaratish, ombordan ortiq so'rash, qabul qilinganda ombor kamayadi", async () => {
  const tooMany = await ctx.api("POST", "/orders", { token: userToken, body: { bookId, amount: 10 } });
  assert.equal(tooMany.status, 400);

  const order = await ctx.api("POST", "/orders", { token: userToken, body: { bookId, amount: 2 } });
  assert.equal(order.status, 201);
  assert.equal(order.data.status, "pending");

  const duplicate = await ctx.api("POST", "/orders", { token: userToken, body: { bookId, amount: 1 } });
  assert.equal(duplicate.status, 409);

  const mine = await ctx.api("GET", "/orders/my", { token: userToken });
  assert.equal(mine.data.items.length, 1);

  const forbidden = await ctx.api("GET", "/orders", { token: userToken });
  assert.equal(forbidden.status, 403);

  const accepted = await ctx.api("PATCH", `/orders/${order.data.id}/status`, { token: staff.adminToken, body: { status: "accepted" } });
  assert.equal(accepted.status, 200);
  assert.equal(accepted.data.status, "accepted");
  assert.equal(accepted.data.book.amount, 1);

  const cancel = await ctx.api("DELETE", `/orders/${order.data.id}`, { token: userToken });
  assert.equal(cancel.status, 403, "qabul qilingan buyurtmani bekor qilib bo'lmaydi");

  const rejected = await ctx.api("PATCH", `/orders/${order.data.id}/status`, { token: staff.adminToken, body: { status: "rejected" } });
  assert.equal(rejected.data.book.amount, 3, "rad etilganda ombor tiklanadi");
});

test("foydalanuvchilar: admin bloklaydi, faqat superadmin rol beradi", async () => {
  const list = await ctx.api("GET", "/users?role=user", { token: staff.adminToken });
  assert.equal(list.status, 200);
  const reader = list.data.items.find((u) => u.username === "reader");

  const roleDenied = await ctx.api("PATCH", `/users/${reader.id}/role`, { token: staff.adminToken, body: { role: "admin" } });
  assert.equal(roleDenied.status, 403);

  const blocked = await ctx.api("PATCH", `/users/${reader.id}/status`, { token: staff.adminToken, body: { status: false } });
  assert.equal(blocked.status, 200);
  const me = await ctx.api("GET", "/auth/me", { token: userToken });
  assert.equal(me.status, 403, "bloklangan foydalanuvchi kira olmaydi");

  const promoted = await ctx.api("PATCH", `/users/${reader.id}/role`, { token: staff.superToken, body: { role: "admin" } });
  assert.equal(promoted.status, 200);
  assert.equal(promoted.data.role, "admin");
});

test("statistika ochiq va admin uchun", async () => {
  const pub = await ctx.api("GET", "/stats");
  assert.equal(pub.status, 200);
  assert.equal(pub.data.books, 1);
  const adm = await ctx.api("GET", "/stats/admin", { token: staff.adminToken });
  assert.equal(adm.status, 200);
  assert.equal(adm.data.orders.total, 1);
});

test("kategoriyani kitobi bo'lsa o'chirib bo'lmaydi", async () => {
  const res = await ctx.api("DELETE", `/categories/${categoryId}`, { token: staff.adminToken });
  assert.equal(res.status, 409);
});
