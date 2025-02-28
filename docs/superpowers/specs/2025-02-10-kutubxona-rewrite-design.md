# Kutubxona — to'liq qayta yozish (dizayn hujjati)

**Sana:** 2025-02-10 · **Muddat:** 2025-02-10 → 2025-02-28

## Maqsad
Eski loyiha (uch xil login, tarqoq kod, global `window.fetch*` yordamchilar) o'rniga
bitta toza monorepo: `backend/` (Express 5 + Sequelize + PostgreSQL) va `frontend/` (Vue 3.5 + Vite + Tailwind 4 + GSAP).

## Asosiy qarorlar
- **Yagona login.** `users` jadvalida `role` ustuni (`user | admin | superadmin`). Bitta `/login` sahifasi, roli bo'yicha yo'naltirish.
- **Asosiy sahifa (`/`).** Hero (GSAP), kategoriyalar, mashhur kitoblar, statistika.
- **Kitob o'qish (`/books/:id/read`).** PDF.js asosida o'qish sahifasi: varaqlash, masshtab, o'qilgan sahifani eslab qolish. Faqat tizimga kirganlar uchun.
- **Buyurtmalar.** Foydalanuvchi kitob buyurtma qiladi (`pending`), admin `accepted/rejected` qiladi.
- **Admin panel (`/admin`).** Dashboard, kitoblar (muqova + PDF yuklash), kategoriyalar, buyurtmalar, foydalanuvchilar (superadmin rollarni o'zgartiradi).

## Texnologiyalar (2025)
Node 22+, Express 5, Sequelize 6 (PostgreSQL), `zod`, `jsonwebtoken`, `multer` 2, `helmet`, `express-rate-limit`;
Vue 3.5, Vite 6, Vue Router 4, Pinia 3, Tailwind CSS 4, GSAP 3.12, `pdfjs-dist`.
Parollar Node `crypto.scrypt` bilan xeshlanadi. Validatsiya `zod` bilan. Testlar `node:test`.
Ma'lumotlar bazasi Docker Compose orqali ko'tariladi.

## Ma'lumotlar bazasi (Sequelize modellari)
`User`, `Category`, `Book`, `Order`. Jadvallar `sequelize.sync()` bilan yaratiladi, namunaviy ma'lumotlar `npm run db:seed`.

## API (prefiks `/api`)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /categories`, `POST|PATCH|DELETE /categories/:id` (admin)
- `GET /books`, `GET /books/:id`, `POST|PATCH|DELETE /books/:id` (admin), `POST /books/:id/cover`, `POST /books/:id/file` (admin)
- `GET /orders/my`, `POST /orders`, `DELETE /orders/:id`; `GET /orders`, `PATCH /orders/:id/status` (admin)
- `GET /users`, `PATCH /users/:id/status`, `PATCH /users/:id/role` (admin/superadmin)
- `GET /stats`

## Yakun (2025-02-28)
Barcha bo'limlar amalga oshirildi: 23 ta backend endpoint, 13 ta API test, 14 ta sahifa (5 tasi admin).
Ishga tushirish va demo hisoblar `README.md` da. Skrinshotlar asosida barcha sahifalar brauzerda tekshirildi.
