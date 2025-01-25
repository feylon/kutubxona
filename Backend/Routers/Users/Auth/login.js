// http://localhost:4100/api/users/login tag AUTH_USER
import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { sign } from "../../../functions/jwt_user.js";
import { check_hash } from "../../../functions/bcrypt.js";
const router = Router();
const Schema = Joi.object({
  login: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(3).required(),
});
router.post("/", async (req, res, next) => {
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let { login, password } = checkSchema.value;
  login = login.toLowerCase().trim();

  try {
    const data = await pool.query(
      `Select id, password, status from users where username = $1`,
      [login]
    );
    if (data.rows.length === 0)
      return res.status(400).send({ error: "Foydalanuvchi topilmadi" });
    const passwordRow = data.rows[0].password;
    const { id, status } = data.rows[0];
    if (!status) {
      return res
        .status(403)
        .send({ message: "Super-Admin tomonidan bloklangan" });
    }
    if (check_hash(password, passwordRow)) {
      let token = await sign(id);
      return res.status(201).send({ token });
    } else {
      return res.status(400).send({ error: "Parol xato" });
    }
  } catch (error) {

    res.status(500).send({ error: "Serverda xatolik mavjud" });
    console.log(error);
  }
  return res.send({ value: checkSchema.value });
});
export default router;
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - AUTH_USER
 *     summary: User Login
 *     description: Authenticates a user using their username and password and returns a JWT token if the credentials are correct.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: The username of the user.
 *                 minLength: 3
 *                 maxLength: 15
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 minLength: 3
 *             required:
 *               - login
 *               - password
 *           example:
 *             login: "johndoe"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: Successfully authenticated and returned the token.
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error in the input data.
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 *       401:
 *         description: Unauthorized - Incorrect login or password.
 *         content:
 *           application/json:
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "Foydalanuvchi topilmadi"
 *               incorrectPassword:
 *                 summary: Incorrect password
 *                 value:
 *                   error: "Parol xato"
 *       403:
 *         description: Forbidden - User account is blocked by the super admin.
 *         content:
 *           application/json:
 *             example:
 *               message: "Super-Admin tomonidan bloklangan"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Serverda xatolik mavjud"
 */
