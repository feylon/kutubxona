import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { validate } from "../lib/validate.js";
import { authenticate } from "../middleware/auth.js";
import * as auth from "../services/auth.service.js";
import { config } from "../config.js";

export const authRouter = Router();

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Kamida 3 ta belgi")
  .max(50)
  .regex(/^[a-zA-Z0-9_.]+$/, "Faqat harf, raqam, _ va . ruxsat etiladi");
const passwordSchema = z.string().min(6, "Parol kamida 6 ta belgi bo'lsin").max(100);

const registerSchema = z.object({
  fullname: z.string().trim().min(3, "Ism kamida 3 ta belgi").max(100),
  username: usernameSchema,
  password: passwordSchema,
});

const loginSchema = z.object({ username: usernameSchema, password: z.string().min(1) });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.isTest ? 1000 : 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring" },
});

authRouter.post("/register", limiter, validate(registerSchema), async (req, res) => {
  const result = await auth.register(req.valid.body);
  res.status(201).json(result);
});

authRouter.post("/login", limiter, validate(loginSchema), async (req, res) => {
  res.json(await auth.login(req.valid.body));
});

authRouter.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

authRouter.patch(
  "/me",
  authenticate,
  validate(z.object({ fullname: z.string().trim().min(3).max(100) })),
  async (req, res) => {
    res.json({ user: await auth.updateProfile(req.user, req.valid.body) });
  },
);

authRouter.post(
  "/change-password",
  authenticate,
  validate(z.object({ currentPassword: z.string().min(1), newPassword: passwordSchema })),
  async (req, res) => {
    await auth.changePassword(req.user, req.valid.body);
    res.json({ message: "Parol o'zgartirildi" });
  },
);
