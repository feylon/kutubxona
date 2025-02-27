# 📚 Kutubxona

Zamonaviy onlayn kutubxona: kitoblarni brauzerda o'qing, qog'oz nusxasiga buyurtma bering, admin panel orqali boshqaring.

**Stek:** Vue 3.5 · Vite 6 · Pinia 3 · Vue Router 4 · Tailwind CSS 4 · GSAP 3 · pdf.js  ·  Express 5 · Sequelize 6 · PostgreSQL 16 · Zod · JWT

## Imkoniyatlar

- **Asosiy sahifa (`/`)** — GSAP animatsiyali hero, kategoriyalar, mashhur va yangi kitoblar, jonli statistika
- **Katalog (`/books`)** — qidiruv, kategoriya filtri, saralash, sahifalash (URL bilan sinxron)
- **Kitob sahifasi** — tafsilotlar, buyurtma berish, o'xshash kitoblar
- **O'qish sahifasi (`/books/:id/read`)** — PDF.js: varaqlash, masshtab, 3 ta mavzu (qog'oz / tungi / sepiya), klaviatura, o'qilgan sahifani eslab qolish
- **Yagona login** — `user`, `admin`, `superadmin` rollari bitta `/login` sahifasidan kiradi
- **Shaxsiy kabinet** — buyurtmalarim, profil, parolni o'zgartirish
- **Admin panel (`/admin`)** — dashboard, kitoblar (muqova + PDF yuklash), kategoriyalar, buyurtmalar (qabul/rad, ombor hisobi), foydalanuvchilar (bloklash, rol berish — superadmin)

## Ishga tushirish

Talablar: Node.js 22+, Docker (PostgreSQL uchun).

```bash
# 1. Bog'liqliklar
npm run install:all

# 2. Ma'lumotlar bazasi (PostgreSQL 16, port 5433)
npm run db:up

# 3. Namunaviy ma'lumotlar (foydalanuvchilar, 18 ta kitob PDF va muqovalari bilan)
npm run db:seed

# 4. Dasturni ishga tushirish (backend :4100 + frontend :5173)
npm run dev
```

Brauzerda: **http://localhost:5173**

Backend sozlamalari `backend/.env` faylida (`backend/.env.example` dan nusxa oling).

### Demo hisoblar

| Rol        | Login        | Parol       |
|------------|--------------|-------------|
| Superadmin | `superadmin` | `Admin123!` |
| Admin      | `admin`      | `Admin123!` |
| O'quvchi   | `kitobxon`   | `User123!`  |

### Ishlab chiqarish rejimi

```bash
npm run build     # frontend/dist
npm start         # backend frontend/dist ni ham tarqatadi → http://localhost:4100
```

### Testlar

```bash
npm test          # backend API testlari (node:test, alohida kutubxona_test bazasi)
```

## Loyiha tuzilishi

```
backend/
  src/
    app.js, server.js, config.js
    db/         sequelize.js, seed.js, seed-data.js
    models/     User, Category, Book, Order
    routes/     auth, books, categories, orders, users, stats
    services/   biznes-mantiq
    middleware/ auth (JWT, rollar), error
    lib/        password (scrypt), jwt, validate (zod), upload (multer), pagination
  tests/        API testlari
  uploads/      covers/, books/
frontend/
  src/
    pages/      Home, Books, BookDetail, Reader, Login, Register, Orders, Profile, NotFound, admin/*
    layouts/    PublicLayout, AdminLayout
    components/ Header, Footer, BookCard, BookCover, Modal, Pagination, Toast …
    stores/     auth, toast (Pinia)
    api/        client (fetch), endpointlar
    composables/ useGsap (reveal, countUp), usePdf
    router/     marshrutlar va himoya
docker-compose.yml   PostgreSQL 16
```

## API (qisqacha)

| Metod | Yo'l | Kim |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | hamma |
| GET/PATCH | `/api/auth/me`, POST `/api/auth/change-password` | kirgan |
| GET | `/api/books`, `/api/books/:id`, `/api/books/top`, `/api/books/latest` | hamma |
| POST/PATCH/DELETE | `/api/books[/:id]`, POST `/api/books/:id/cover`, `/api/books/:id/file` | admin |
| GET | `/api/categories` · POST/PATCH/DELETE (admin) | |
| GET/POST/DELETE | `/api/orders/my`, `/api/orders`, `/api/orders/:id` | kirgan |
| GET/PATCH | `/api/orders`, `/api/orders/:id/status` | admin |
| GET/PATCH/POST | `/api/users`, `/api/users/:id/status`, `/api/users/:id/role` | admin / superadmin |
| GET | `/api/stats`, `/api/stats/admin` | hamma / admin |
