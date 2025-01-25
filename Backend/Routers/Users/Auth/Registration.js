// URL http://localhost:4100/api/users/register tag AUTH_USER
import { Router } from "express";
import pool from "../../../functions/database.js";
import Joi from "joi";
import { hash } from "../../../functions/bcrypt.js";
import { sign } from "../../../functions/jwt_user.js";

const Schema = Joi.object({
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.base": "To'liq ism matn bo'lishi kerak.",
    "string.empty": "To'liq ism bo'sh bo'lishi mumkin emas.",
    "string.min": "To'liq ism kamida 3 ta belgidan iborat bo'lishi kerak.",
    "string.max": "To'liq ism 50 ta belgidan oshmasligi kerak.",
    "any.required": "To'liq ism majburiy maydon.",
  }),
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Foydalanuvchi nomi faqat lotin harflari bilan boshlanishi kerak va faqat harflar, raqamlar yoki pastki chiziq (_) bo‘lishi mumkin.",
      "string.empty": "Foydalanuvchi nomi bo'sh bo'lishi mumkin emas.",
      "string.min":
        "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak.",
      "string.max": "Foydalanuvchi nomi 50 ta belgidan oshmasligi kerak.",
      "any.required": "Foydalanuvchi nomi majburiy maydon.",
    }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.base": "Parol matn bo'lishi kerak.",
    "string.empty": "Parol bo'sh bo'lishi mumkin emas.",
    "string.min": "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
    "string.max": "Parol 50 ta belgidan oshmasligi kerak.",
    "any.required": "Parol majburiy maydon.",
  }),
});

const router = Router();
router.post("/", async (req, res) => {
  const checkSchema = Schema.validate(req.body, { abortEarly: false });
  const { error, value } = checkSchema;
  if (error) {
    return res.status(400).send({
      error: error.details.map((err) => err.message),
    });
  }
  const { fullname, username } = value;
  let { password } = value;
  password = hash(password);
  try {
    let query =
      "insert into users (fullname, username, password) values ($1, $2, $3) returning id ";
    let data = await pool.query(query, [fullname, username, password]);
    let UUID = data.rows[0].id;
    let token = await sign(UUID);
    return res.status(201).send({ token });
  } catch (error) {
    if ((error.code = "23505"))
      return res
        .status(409)
        .send({ error: `'${username}' allaqachon ro'yxatdan o'tgan` });

    res.status(500).send({ error: "Server Error" });
    console.log(error);
  }
});
export default router;

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - AUTH_USER
 *     summary: User Registration
 *     description: Registers a new user by providing their full name, username, and password, and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the user.
 *                 minLength: 3
 *                 maxLength: 50
 *               username:
 *                 type: string
 *                 description: The username of the user (should follow the pattern of alphanumeric characters and underscores, starting with a letter).
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 minLength: 3
 *                 maxLength: 50
 *             required:
 *               - fullname
 *               - username
 *               - password
 *           example:
 *             fullname: "John Doe"
 *             username: "johndoe"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: Successfully registered and returned the JWT token.
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - Validation error or username already exists.
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Validation error in input fields
 *                 value:
 *                   error: "Validation error message"
 *               usernameExists:
 *                 summary: Username already exists
 *                 value:
 *                   error: "'johndoe' allaqachon ro'yxatdan o'tgan"
 *       500:
 *         description: Internal server error while processing the registration.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server Error"
 */
