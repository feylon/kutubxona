// url http://localhost:4100/api/users/book/getHasBookCategory tags 'USERS BOOK'
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await pool.query(` 
SELECT DISTINCT 
    bookcategory.id,
    bookcategory.name
FROM 
    bookcategory
INNER JOIN 
    book ON book.category = bookcategory.id
WHERE 
    book.picture IS NOT NULL 
    AND book.status
    
    ;

`);

    res.status(200).send(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

export default router;

/**
 * @swagger
 * /api/users/book/getHasBookCategory:
 *   get:
 *     summary: Retrieve book categories with books that meet specific conditions
 *     tags:
 *       - USERS BOOK
 *     description: Fetches all book categories that have at least one book with a non-null picture and active status.
 *     responses:
 *       200:
 *         description: A list of book categories with valid books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the book category.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the book category.
 *                     example: "Fiction"
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
