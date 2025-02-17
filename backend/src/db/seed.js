/**
 * Namunaviy ma'lumotlar: foydalanuvchilar, kategoriyalar, kitoblar (PDF + muqova), buyurtmalar.
 * Ishlatish: npm run db:seed        (bazada kitob bo'lsa to'xtaydi)
 *            npm run db:seed -- --force   (hamma jadvallarni tozalab qayta yaratadi)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { config } from "../config.js";
import { sequelize } from "./sequelize.js";
import { User, Category, Book, Order } from "../models/index.js";
import { hashPassword } from "../lib/password.js";
import { slugify } from "../lib/slug.js";
import { CATEGORIES, BOOKS, SENTENCES } from "./seed-data.js";

const force = process.argv.includes("--force");

const ascii = (s) => s.replace(/[ʻ’‘]/g, "'").replace(/[^\x00-\x7F]/g, "");

const wrap = (text, font, size, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
};

const makePdf = async (book, pages) => {
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const W = 420;
  const H = 595;
  const margin = 48;

  // Titul sahifa
  const title = pdf.addPage([W, H]);
  title.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.97, 0.95, 0.9) });
  const t = ascii(book.title);
  wrap(t, serifBold, 26, W - margin * 2).forEach((l, i) =>
    title.drawText(l, { x: margin, y: H / 2 + 40 - i * 32, size: 26, font: serifBold, color: rgb(0.15, 0.1, 0.05) }),
  );
  title.drawText(ascii(book.author), { x: margin, y: H / 2 - 40, size: 14, font: serif, color: rgb(0.4, 0.3, 0.2) });
  title.drawText(`${book.year}`, { x: margin, y: margin, size: 11, font: serif, color: rgb(0.5, 0.5, 0.5) });

  let seed = book.title.length;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  for (let p = 1; p <= pages; p++) {
    const page = pdf.addPage([W, H]);
    page.drawText(`${p}-bob`, { x: margin, y: H - margin, size: 16, font: serifBold, color: rgb(0.2, 0.15, 0.1) });
    let y = H - margin - 34;
    while (y > margin + 30) {
      const count = 3 + Math.floor(rand() * 4);
      const paragraph = Array.from({ length: count }, () => SENTENCES[Math.floor(rand() * SENTENCES.length)]).join(" ");
      for (const line of wrap(ascii(paragraph), serif, 11, W - margin * 2)) {
        if (y < margin + 30) break;
        page.drawText(line, { x: margin, y, size: 11, font: serif, color: rgb(0.1, 0.1, 0.1), lineHeight: 15 });
        y -= 15;
      }
      y -= 10;
    }
    page.drawText(`${p + 1}`, { x: W / 2 - 5, y: margin - 20, size: 9, font: serif, color: rgb(0.5, 0.5, 0.5) });
  }
  return pdf.save();
};

const makeCover = (book) => {
  const h = book.hue;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#39;");
  const words = book.title.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 16 && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  const titleSvg = lines
    .map((l, i) => `<text x="32" y="${300 + i * 40}" font-size="32" font-weight="700" fill="#fff" font-family="Georgia, serif">${esc(l)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${h} 70% 38%)"/>
      <stop offset="1" stop-color="hsl(${(h + 40) % 360} 60% 18%)"/>
    </linearGradient>
    <pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="1.5" fill="rgba(255,255,255,0.12)"/>
    </pattern>
  </defs>
  <rect width="400" height="600" fill="url(#g)"/>
  <rect width="400" height="600" fill="url(#p)"/>
  <rect x="0" y="0" width="18" height="600" fill="rgba(0,0,0,0.25)"/>
  <circle cx="330" cy="110" r="90" fill="rgba(255,255,255,0.08)"/>
  <rect x="32" y="250" width="56" height="4" fill="rgba(255,255,255,0.8)"/>
  ${titleSvg}
  <text x="32" y="${300 + lines.length * 40 + 10}" font-size="16" fill="rgba(255,255,255,0.8)" font-family="Helvetica, Arial, sans-serif">${esc(book.author)}</text>
  <text x="32" y="560" font-size="12" letter-spacing="3" fill="rgba(255,255,255,0.55)" font-family="Helvetica, Arial, sans-serif">KUTUBXONA · ${book.year}</text>
</svg>`;
};

const run = async () => {
  await sequelize.authenticate();
  if (force) {
    console.log("⚠️  --force: jadvallar qayta yaratilmoqda");
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
    if ((await Book.count()) > 0) {
      console.log("Bazada kitoblar bor. Qayta to'ldirish uchun: npm run db:seed -- --force");
      return;
    }
  }

  const coversDir = path.join(config.uploadsDir, "covers");
  const booksDir = path.join(config.uploadsDir, "books");
  await fs.mkdir(coversDir, { recursive: true });
  await fs.mkdir(booksDir, { recursive: true });

  const [superadmin, admin, reader1, reader2] = await Promise.all([
    User.findOrCreate({ where: { username: "superadmin" }, defaults: { fullname: "Bosh administrator", passwordHash: hashPassword("Admin123!"), role: "superadmin" } }),
    User.findOrCreate({ where: { username: "admin" }, defaults: { fullname: "Kutubxonachi", passwordHash: hashPassword("Admin123!"), role: "admin" } }),
    User.findOrCreate({ where: { username: "kitobxon" }, defaults: { fullname: "Dilnoza Karimova", passwordHash: hashPassword("User123!"), role: "user" } }),
    User.findOrCreate({ where: { username: "sardor" }, defaults: { fullname: "Sardor Aliyev", passwordHash: hashPassword("User123!"), role: "user" } }),
  ]).then((r) => r.map(([u]) => u));

  const categories = {};
  for (const name of CATEGORIES) {
    const [c] = await Category.findOrCreate({ where: { slug: slugify(name) }, defaults: { name } });
    categories[name] = c;
  }

  const created = [];
  for (const [i, b] of BOOKS.entries()) {
    const slug = slugify(b.title);
    const pages = 8 + (i % 5) * 3;
    const pdfBytes = await makePdf(b, pages);
    await fs.writeFile(path.join(booksDir, `${slug}.pdf`), pdfBytes);
    await fs.writeFile(path.join(coversDir, `${slug}.svg`), makeCover(b));
    const book = await Book.create({
      title: b.title,
      author: b.author,
      description: b.description,
      year: b.year,
      pages: pages + 1,
      price: b.price,
      amount: b.amount,
      categoryId: categories[b.category].id,
      coverUrl: `/uploads/covers/${slug}.svg`,
      fileUrl: `/uploads/books/${slug}.pdf`,
      views: Math.floor(((i * 37) % 23) * 11 + 15),
    });
    created.push(book);
    process.stdout.write(`📘 ${b.title}\n`);
  }

  await Order.bulkCreate([
    { userId: reader1.id, bookId: created[0].id, amount: 1, status: "accepted" },
    { userId: reader1.id, bookId: created[4].id, amount: 2, status: "pending", note: "Iloji bo'lsa yangi nashri" },
    { userId: reader2.id, bookId: created[7].id, amount: 1, status: "pending" },
    { userId: reader2.id, bookId: created[9].id, amount: 1, status: "rejected" },
  ]);

  console.log(`\n✅ Tayyor: ${CATEGORIES.length} kategoriya, ${created.length} kitob, 4 buyurtma`);
  console.log("👤 superadmin / Admin123!   admin / Admin123!   kitobxon / User123!");
  void superadmin; void admin;
};

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
