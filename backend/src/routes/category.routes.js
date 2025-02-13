import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validate.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import * as categories from "../services/category.service.js";

export const categoryRouter = Router();

const bodySchema = z.object({ name: z.string().trim().min(2, "Kamida 2 ta belgi").max(120) });
const idSchema = z.object({ id: z.string().uuid("ID noto'g'ri") });

categoryRouter.get("/", async (_req, res) => {
  res.json({ items: await categories.listCategories() });
});

categoryRouter.post("/", authenticate, requireAdmin, validate(bodySchema), async (req, res) => {
  res.status(201).json(await categories.createCategory(req.valid.body));
});

categoryRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idSchema, "params"),
  validate(bodySchema),
  async (req, res) => {
    res.json(await categories.updateCategory(req.valid.params.id, req.valid.body));
  },
);

categoryRouter.delete("/:id", authenticate, requireAdmin, validate(idSchema, "params"), async (req, res) => {
  await categories.deleteCategory(req.valid.params.id);
  res.status(204).end();
});
