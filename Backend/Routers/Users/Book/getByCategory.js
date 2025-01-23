// URL = http://localhost:4100/api/superadmin/book/getByCategory?category=40b1adf3-12ef-4edf-9030-bfcec48268a6&page=1 TAGS - Super-admin-Book
import { verify } from "../../../functions/jwt_user.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";

const router = Router();

const Schema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().uuid().required(),
});

router.get("/", verify, async (req, res) => {
  const { error, value } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ error: error.message });
  }

  const { page, limit, category } = value;
  const offset = (page - 1) * limit;

  try {
    const totalBooksQuery = await pool.query(
      `
      SELECT COUNT(*) 
      FROM book
      INNER JOIN bookcategory b ON b.id = book.category
     where   book.picture is not null and book.status and b.id = $1
    `,
      [category]
    );
    const totalBooks = parseInt(totalBooksQuery.rows[0].count, 10);

    const booksQuery = await pool.query(
      `
      SELECT 
        book.id AS key,
        book.name AS book_name,
        book.price AS book_price,
        book.amount AS book_amount,
        book.category AS category_id,
        b.name AS category_name,
		    book.file_url as file,
		    book.picture as picture
      FROM book
      INNER JOIN bookcategory b ON b.id = book.category
      where   book.picture is not null and book.status and b.id = $3
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
