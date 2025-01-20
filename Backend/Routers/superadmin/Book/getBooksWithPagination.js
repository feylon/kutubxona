import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";

const router = Router();

const Schema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

router.get("/", verify, async (req, res) => {
  const { error, value } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ error: error.message });
  }

  const { page, limit } = value;
  const offset = (page - 1) * limit;

  try {
    const totalBooksQuery = await pool.query(`
      SELECT COUNT(*) 
      FROM book
      INNER JOIN bookcategory b ON b.id = book.category
    `);
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
      ORDER BY book.name
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
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
 * /api/superadmin/book/get:
 *   get:
 *     tags:
 *       - Super-admin-Book
 *     summary: Retrieve books with pagination and category details
 *     description: This endpoint retrieves a paginated list of books, including category details.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number to fetch.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of books to fetch per page.
 *     responses:
 *       200:
 *         description: A paginated list of books with category details
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
 *                         description: The unique identifier of the book.
 *                       book_name:
 *                         type: string
 *                         description: The name of the book.
 *                       book_status:
 *                         type: boolean
 *                         description: The availability status of the book.
 *                       book_price:
 *                         type: number
 *                         format: float
 *                         description: The price of the book.
 *                       book_amount:
 *                         type: integer
 *                         description: The available quantity of the book.
 *                       category_id:
 *                         type: string
 *                         description: The UUID of the book's category.
 *                       category_name:
 *                         type: string
 *                         description: The name of the book's category.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: integer
 *                       description: Total number of books.
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages.
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number.
 *                     limit:
 *                       type: integer
 *                       description: Number of books per page.
 *       400:
 *         description: Bad Request (Invalid query parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
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
 */
