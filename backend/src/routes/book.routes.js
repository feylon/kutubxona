import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validate.js";
import { paginationSchema } from "../lib/pagination.js";
import { authenticate, optionalAuth, requireAdmin } from "../middleware/auth.js";
import * as books from "../services/book.service.js";

export const bookRouter = Router();

const idSchema = z.object({ id: z.string().uuid("ID noto'g'ri") });

const listSchema = paginationSchema.extend({
  search: z.string().trim().max(100).optional(),
  categoryId: z.string().uuid().optional(),
  sort: z.enum(["newest", "popular", "title", "price_asc", "price_desc"]).optional(),
  available: z.coerce.boolean().optional(),
  all: z.coerce.boolean().optional(),
});

const bookBody = z.object({
  title: z.string().trim().min(2).max(200),
  author: z.string().trim().min(2).max(120),
  description: z.string().trim().max(5000).default(""),
  year: z.coerce.number().int().min(800).max(2100).nullable().optional(),
  pages: z.coerce.number().int().min(1).nullable().optional(),
  price: z.coerce.number().min(0).default(0),
  amount: z.coerce.number().int().min(0).default(0),
  status: z.coerce.boolean().default(true),
  categoryId: z.string().uuid("Kategoriya tanlang"),
});

const isAdmin = (req) => ["admin", "superadmin"].includes(req.user?.role);

bookRouter.get("/", optionalAuth, validate(listSchema, "query"), async (req, res) => {
  const q = req.valid.query;
  res.json(await books.listBooks(q, { includeInactive: Boolean(q.all && isAdmin(req)) }));
});

bookRouter.get("/top", async (_req, res) => res.json({ items: await books.topBooks() }));
bookRouter.get("/latest", async (_req, res) => res.json({ items: await books.latestBooks() }));

bookRouter.get("/:id", optionalAuth, validate(idSchema, "params"), async (req, res) => {
  const { id } = req.valid.params;
  res.json(isAdmin(req) ? await books.getBook(id, { includeInactive: true }) : await books.viewBook(id));
});

bookRouter.post("/", authenticate, requireAdmin, validate(bookBody), async (req, res) => {
  res.status(201).json(await books.createBook(req.valid.body));
});

bookRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idSchema, "params"),
  validate(bookBody.partial()),
  async (req, res) => {
    res.json(await books.updateBook(req.valid.params.id, req.valid.body));
  },
);

bookRouter.delete("/:id", authenticate, requireAdmin, validate(idSchema, "params"), async (req, res) => {
  await books.deleteBook(req.valid.params.id);
  res.status(204).end();
});
