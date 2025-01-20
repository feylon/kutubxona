import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const Schema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(50).required(),
  status: Joi.boolean().required(),
  price: Joi.number().min(0).max(100000).required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().uuid().required(),
});

const router = Router();

router.patch("/", verify, async (req, res) => {
  const checkSchema = Schema.validate(req.body);
  const { error, value } = checkSchema;

  if (error) return res.status(400).send({ error: error.message });

  const { id, name, status, price, amount, category } = value;

  try {
    const data = await pool.query(
      `
      UPDATE book
      SET name = $1, status = $2, price = $3, amount = $4, category = $5
      WHERE id = $6
      RETURNING id, name, status, price, amount, category
      `,
      [name, status, price, amount, category, id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ error: "Kitob mavjud emas" });
    }

    return res.status(200).send(data.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).send({ error: "Xato ID" });
    }

    if (error.code === "23505") {
      return res.status(400).send({ error: `'${name}' Allaqachon yaratilgan` });
    }

    return res.status(500).send({ error: "Server Error" });
    console.log(error);
  }
});

export default router;
/**
 * @swagger
 * /api/superadmin/book/Editbook:
 *   patch:
 *     tags:
 *       - Super-admin-Book
 *     summary: Edit an existing book
 *     description: Allows a Super Admin to update an existing book's details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The unique identifier of the book to be updated.
 *                 example: "9d8572a3-16a1-4bc3-8e2b-3a1d1239cdee"
 *               name:
 *                 type: string
 *                 description: The updated name of the book (3-50 characters).
 *                 example: "Advanced Mathematics"
 *               status:
 *                 type: boolean
 *                 description: The updated status of the book (true for active, false for inactive).
 *                 example: true
 *               price:
 *                 type: number
 *                 description: The updated price of the book.
 *                 example: 59.99
 *               amount:
 *                 type: integer
 *                 description: The updated quantity of the book available.
 *                 example: 150
 *               category:
 *                 type: string
 *                 format: uuid
 *                 description: The updated ID of the book category (must exist in the database).
 *                 example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The unique identifier of the updated book.
 *                   example: "9d8572a3-16a1-4bc3-8e2b-3a1d1239cdee"
 *                 name:
 *                   type: string
 *                   description: The updated name of the book.
 *                   example: "Advanced Mathematics"
 *                 status:
 *                   type: boolean
 *                   description: The updated status of the book.
 *                   example: true
 *                 price:
 *                   type: number
 *                   description: The updated price of the book.
 *                   example: 59.99
 *                 amount:
 *                   type: integer
 *                   description: The updated quantity of the book available.
 *                   example: 150
 *                 category:
 *                   type: string
 *                   format: uuid
 *                   description: The updated category ID of the book.
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
 *       404:
 *         description: Not Found - Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book not found"
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
