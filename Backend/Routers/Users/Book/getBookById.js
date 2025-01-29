// URL = http://localhost:4100/api/users/book/getBookById/d990efe5-0f05-4f25-8b7a-594ea1f972e2
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";

const router = Router();

const schema = Joi.object({
  id: Joi.string().uuid().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

router.get("/:id/:page/:limit", async (req, res) => {
  const { error, value } = schema.validate(req.params);
  if (error) return res.status(400).send({ error: error.message });

  try {
    const { id, page, limit } = value;
    const offset = (page - 1) * limit;

    const booksQuery = `
      SELECT
        book.id AS book_id,
        bc.id AS bc_id,
        book.name,
        false AS select,
        book.picture,
        book.price AS price,
        bc.name AS category_name,
        book.picture AS picture
      FROM book
      INNER JOIN bookcategory bc ON bc.id = book.category 
      WHERE book.picture IS NOT NULL 
      AND book.status 
      AND bc.id = $1
      ORDER BY book.name
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM book
      INNER JOIN bookcategory bc ON bc.id = book.category 
      WHERE book.picture IS NOT NULL 
      AND book.status 
      AND bc.id = $1
    `;

    const booksResult = await pool.query(booksQuery, [id, limit, offset]);
    const countResult = await pool.query(countQuery, [id]);

    const totalRecords = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      data: booksResult.rows,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;

/**
 * @swagger
 * /api/users/book/getBookById/{id}:
 *   get:
 *     summary: Retrieve books by category ID
 *     tags:
 *       - USERS BOOK
 *     description: Fetches up to 5 books by a specific category ID. Books must have a non-null picture, active status, and belong to the specified category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "d990efe5-0f05-4f25-8b7a-594ea1f972e2"
 *         description: The UUID of the book category.
 *     responses:
 *       200:
 *         description: A list of books matching the category ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   book_id:
 *                     type: string
 *                     description: The UUID of the book.
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   bc_id:
 *                     type: string
 *                     description: The UUID of the book category.
 *                     example: "d990efe5-0f05-4f25-8b7a-594ea1f972e2"
 *                   name:
 *                     type: string
 *                     description: The name of the book.
 *                     example: "The Great Gatsby"
 *                   picture:
 *                     type: string
 *                     description: The URL of the book's picture.
 *                     example: "https://example.com/picture.jpg"
 *                   price:
 *                     type: number
 *                     description: The price of the book.
 *                     example: 29.99
 *                   category_name:
 *                     type: string
 *                     description: The name of the book category.
 *                     example: "Fiction"
 *       400:
 *         description: Invalid category ID provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid UUID format"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error"
 */
