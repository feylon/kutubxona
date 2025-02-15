import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validate.js";
import { paginationSchema } from "../lib/pagination.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { ORDER_STATUSES } from "../models/index.js";
import * as orders from "../services/order.service.js";

export const orderRouter = Router();
orderRouter.use(authenticate);

const idSchema = z.object({ id: z.string().uuid("ID noto'g'ri") });

orderRouter.get("/my", async (req, res) => res.json({ items: await orders.myOrders(req.user) }));

orderRouter.post(
  "/",
  validate(
    z.object({
      bookId: z.string().uuid("Kitob ID noto'g'ri"),
      amount: z.coerce.number().int().min(1).max(50).default(1),
      note: z.string().trim().max(300).optional(),
    }),
  ),
  async (req, res) => res.status(201).json(await orders.createOrder(req.user, req.valid.body)),
);

orderRouter.delete("/:id", validate(idSchema, "params"), async (req, res) => {
  await orders.cancelOrder(req.user, req.valid.params.id);
  res.status(204).end();
});

orderRouter.get(
  "/",
  requireAdmin,
  validate(
    paginationSchema.extend({
      status: z.enum(ORDER_STATUSES).optional(),
      search: z.string().trim().max(100).optional(),
    }),
    "query",
  ),
  async (req, res) => res.json(await orders.listOrders(req.valid.query)),
);

orderRouter.patch(
  "/:id/status",
  requireAdmin,
  validate(idSchema, "params"),
  validate(z.object({ status: z.enum(ORDER_STATUSES) })),
  async (req, res) => res.json(await orders.setOrderStatus(req.valid.params.id, req.valid.body.status)),
);
