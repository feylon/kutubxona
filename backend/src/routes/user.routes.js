import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validate.js";
import { paginationSchema } from "../lib/pagination.js";
import { authenticate, requireAdmin, requireSuperAdmin } from "../middleware/auth.js";
import { ROLES } from "../models/index.js";
import * as users from "../services/user.service.js";

export const userRouter = Router();
userRouter.use(authenticate, requireAdmin);

const idSchema = z.object({ id: z.string().uuid("ID noto'g'ri") });

userRouter.get(
  "/",
  validate(
    paginationSchema.extend({ role: z.enum(ROLES).optional(), search: z.string().trim().max(100).optional() }),
    "query",
  ),
  async (req, res) => res.json(await users.listUsers(req.valid.query)),
);

userRouter.patch(
  "/:id/status",
  validate(idSchema, "params"),
  validate(z.object({ status: z.boolean() })),
  async (req, res) => res.json(await users.setStatus(req.user, req.valid.params.id, req.valid.body.status)),
);

userRouter.patch(
  "/:id/role",
  requireSuperAdmin,
  validate(idSchema, "params"),
  validate(z.object({ role: z.enum(ROLES) })),
  async (req, res) => res.json(await users.setRole(req.user, req.valid.params.id, req.valid.body.role)),
);

userRouter.post(
  "/",
  requireSuperAdmin,
  validate(
    z.object({
      fullname: z.string().trim().min(3).max(100),
      username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9_.]+$/),
      password: z.string().min(6).max(100),
      role: z.enum(ROLES).default("admin"),
    }),
  ),
  async (req, res) => res.status(201).json(await users.createStaff(req.valid.body)),
);
