import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_user.js";

const router = Router();

const orderSchema = Joi.object({
  active: Joi.boolean().default(false),
  accept: Joi.boolean().default(false),
  amount: Joi.number().integer().positive().required(),
  books: Joi.array().items(Joi.string().uuid()).min(1).required().unique(),
});

router.post("/", verify, async (req, res) => {
  const { id: users_id } = req;

  const { error, value } = orderSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
const {books, active, accept,  amount} = value
  try {
    await pool.query("BEGIN"); // Start

    const orderResult = await pool.query(
      `INSERT INTO orders (users_id, active, accept, amount) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [users_id, active, accept, amount]
    );
    const orderId = orderResult.rows[0].id;

    const orderBooksQueries = books.map((bookId) => {
      return pool.query(
        `INSERT INTO order_books (order_id, book_id) VALUES ($1, $2)`,
        [orderId, bookId]
      );
    });
    await Promise.all(orderBooksQueries);

    await pool.query("COMMIT"); // Commit
    res.status(201).send({ message: "Order created successfully", orderId });
  } catch (err) {
    await pool.query("ROLLBACK"); // Rollback
    if(err.code = '23503') return res.status(500).send({ error: "Kitob topilmadi" })
    console.error(err);
    res.status(500).send({ error: "server Xato" });
  } finally {
  }
});

router.get("/", verify, async (req, res) => {
  const { id: users_id } = req; // User ID from token

  try {
    const ordersResult = await pool.query(
      `SELECT o.id, o.active, o.accept, o.amount, o.created_at, o.status, 
              ARRAY_AGG(ob.book_id) AS books
       FROM orders o
       LEFT JOIN order_books ob ON o.id = ob.order_id
       WHERE o.users_id = $1
       GROUP BY o.id`,
      [users_id]
    );

    res.status(200).send({ orders: ordersResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Xato" });
  }
});

export default router;
