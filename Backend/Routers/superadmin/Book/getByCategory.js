// URL = http://localhost:4100/api/superadmin/book/getByCategory?category=40b1adf3-12ef-4edf-9030-bfcec48268a6&page=1 TAGS - Super-admin-Book
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";

const router = Router();

const Schema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category : Joi.string().uuid().required()
});

router.get("/", verify, async (req, res) => {
  const { error, value } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ error: error.message });
  }

  const { page, limit, category } = value;
  const offset = (page - 1) * limit;

  try {
    const totalBooksQuery = await pool.query(`
      SELECT COUNT(*) 
      FROM book
      INNER JOIN bookcategory b ON b.id = book.category
      where b.id = $1
    `,[category]);
    const totalBooks = parseInt(totalBooksQuery.rows[0].count, 10);

    const booksQuery = await pool.query(
      `
      SELECT 
        book.id AS book_id,
        book.name AS book_name,
        book.status AS book_status,
        book.price AS book_price,
        book.amount AS book_amount,
        book.category AS category_id,
        b.name AS category_name
      FROM book
      INNER JOIN bookcategory b ON b.id = book.category
      where b.id = $3
      ORDER BY book.name
      LIMIT $1 OFFSET $2
      `,
      [limit, offset, category]
    );

    const books = booksQuery.rows;

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).send({
      data: books,
      pagination: {
        totalBooks,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

export default router;
/**
 * @swagger
 * /api/superadmin/book/getByCategory:
 *   get:
 *     tags:
 *       - Super-admin-Book
 *     summary: Get books by category
 *     description: Fetch a paginated list of books based on the given category.
 *     parameters:
 *       - name: category
 *         in: query
 *         required: true
 *         description: UUID of the book category to filter.
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of items per page (default is 10, max is 100).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       book_id:
 *                         type: string
 *                         format: uuid
 *                         description: ID of the book
 *                       book_name:
 *                         type: string
 *                         description: Name of the book
 *                       book_status:
 *                         type: string
 *                         description: Status of the book
 *                       book_price:
 *                         type: number
 *                         format: float
 *                         description: Price of the book
 *                       book_amount:
 *                         type: integer
 *                         description: Number of books available
 *                       category_id:
 *                         type: string
 *                         format: uuid
 *                         description: ID of the category
 *                       category_name:
 *                         type: string
 *                         description: Name of the category
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: integer
 *                       description: Total number of books in the category
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     security:
 *       - BearerAuth: []
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
