// URL = http://localhost:4100/api/users/book/getBookById/d990efe5-0f05-4f25-8b7a-594ea1f972e2
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";

const Schema = Joi.string().uuid().required();
const router = Router();

router.get("/:id", async (req, res) => {
  const schema = Schema.validate(req.params.id);
  const { value, error } = schema;

  if (error) return res.status(400).send({ error: error.message });
  try {
    const data = await pool.query(`Select
book.id as book_id,
bc.id as bc_id,
book.name,
false as select,
book.picture,
book.price as price,
bc.name as category_name,
book.picture as picture
from book
inner join bookcategory bc on  bc.id = book.category 
where book.picture is not null and book.status and bc.id = $1
order by book.name
limit 5
  
`,[value]);

return res.status(200).send(data.rows);
  } catch (error) {
    console.log(error)
return res.status(200).send({error : "Server error"});
    
  }

  return res.send({ id:value });
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