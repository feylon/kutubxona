// URL http://localhost:4100/api/users/book/getTopBook tag 'USERS BOOK'
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await pool.query(`Select 
book.id,
book.name,
book.price as price,
bk.name as category_name,
book.picture as picture
from book
inner join bookcategory bk on book.category = bk.id
where book.picture is not null and book.status and bk.name = 'top kitoblar'
limit 6 `);

    res.status(200).send(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

export default router;

/**
 * @swagger
 * /api/users/book/getTopBook:
 *   get:
 *     summary: Retrieve top books
 *     tags:
 *       - USERS BOOK
 *     description: Fetches the top books that are available, with their details like name, price, category, and picture.
 *     responses:
 *       200:
 *         description: A list of top books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the book.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the book.
 *                     example: "The Great Gatsby"
 *                   price:
 *                     type: number
 *                     description: The price of the book.
 *                     example: 29.99
 *                   category_name:
 *                     type: string
 *                     description: The category of the book.
 *                     example: "Fiction"
 *                   picture:
 *                     type: string
 *                     description: The URL to the picture of the book.
 *                     example: "https://example.com/picture.jpg"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server Error"
 */
