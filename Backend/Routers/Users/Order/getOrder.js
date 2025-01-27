import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_user.js";
const router = Router();
router.get("/", verify, async (req, res) => {
  const { id: users_id } = req;

  try {
    const ordersResult = await pool.query(
      `SELECT
orders.id,
orders.book_id,
orders.amount,
orders.status,
orders.active,
orders.accept,
orders.created_at,
b.name as name,
b.price as price,
b.picture as picture
FROM orders 
inner join book b on b.id = orders.book_id
where orders.users_id = $1`,
      [users_id]
    );

    res.status(200).send(ordersResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server xato" });
  }
});
export default router;
/**
 * @swagger
 * /api/users/book/getorder:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags:
 *       - Orders USERS
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique ID of the order
 *                     example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                   book_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique ID of the book in the order
 *                     example: "a9af5539-7f74-40b2-892a-406d8ff67362"
 *                   amount:
 *                     type: integer
 *                     description: The quantity of the book in the order
 *                     example: 2
 *                   status:
 *                     type: string
 *                     enum: [pending, accepted, rejected]
 *                     description: The status of the order
 *                     example: "pending"
 *                   active:
 *                     type: boolean
 *                     description: Whether the order is active
 *                     example: false
 *                   accept:
 *                     type: boolean
 *                     description: Whether the order is accepted
 *                     example: false
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the order was created
 *                     example: "2025-01-01T10:00:00Z"
 *                   name:
 *                     type: string
 *                     description: The name of the book in the order
 *                     example: "JavaScript: The Good Parts"
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the book in the order
 *                     example: 19.99
 *                   picture:
 *                     type: string
 *                     description: The URL to the picture of the book
 *                     example: "https://example.com/images/book.jpg"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server xato"
 */
