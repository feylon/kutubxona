import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const Schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  status: Joi.boolean().required(),
  price: Joi.number().min(0).max(100000).required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().uuid().required(),
});

const router = Router();

router.post("/", verify, async (req, res) => {
  const checkSchema = Schema.validate(req.body);
  const { error, value } = checkSchema;

  if (error) return res.status(400).send({ error: error.message });

  const { name, status, price, amount, category } = value;

  try {
    const data = await pool.query(
      `
      INSERT INTO book (name, status, price, amount, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, status, price, amount, category
      `,
      [name, status, price, amount, category]
    );

    return res.status(201).send(data.rows[0]);
  } catch (error) {
    console.log(error);

   if (error.code === "23503") {
      return res.status(400).send({ error: "Xato ID" });
    }
    if (error.code === "23505") {
      return res.status(400).send({ error: `'${name}' allaqachon yaratilgan` });
    }

    return res.status(500).send({ error: "Server Error" });
  }
});

export default router;
/**
 * @swagger
 * /api/superadmin/Addbook:
 *   post:
 *     tags:
 *       - Super-admin-Book
 *     summary: Add a new book
 *     description: Allows a Super Admin to add a new book to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the book (3-50 characters).
 *                 example: "Mathematics 101"
 *               status:
 *                 type: boolean
 *                 description: The status of the book (true for active, false for inactive).
 *                 example: true
 *               price:
 *                 type: number
 *                 description: The price of the book.
 *                 example: 49.99
 *               amount:
 *                 type: integer
 *                 description: The quantity of the book available.
 *                 example: 100
 *               category:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the book category (must exist in the database).
 *                 example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *     responses:
 *       201:
 *         description: Book successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The unique identifier of the newly created book.
 *                   example: "9d8572a3-16a1-4bc3-8e2b-3a1d1239cdee"
 *                 name:
 *                   type: string
 *                   description: The name of the book.
 *                   example: "Mathematics 101"
 *                 status:
 *                   type: boolean
 *                   description: The status of the book.
 *                   example: true
 *                 price:
 *                   type: number
 *                   description: The price of the book.
 *                   example: 49.99
 *                 amount:
 *                   type: integer
 *                   description: The quantity of the book available.
 *                   example: 100
 *                 category:
 *                   type: string
 *                   format: uuid
 *                   description: The category ID of the book.
 *                   example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *       400:
 *         description: Bad Request - Validation or Foreign Key Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid category ID"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server Error"
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
