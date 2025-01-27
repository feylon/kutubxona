// url http://localhost:4100/api/admin/editOrder/42968f29-ffaa-4ae5-8fd3-047fb6c8d611 
import { Router } from "express";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_admin.js"; 
import Joi from "joi";
const router = Router();
const Schema = Joi.string().required().uuid();
router.put("/:orderId", verify, async (req, res) => {
    const { orderId } = req.params;
    const checkSchema = Schema.validate(orderId);
    const {error} = checkSchema;
    if(error) return res.status(400).send({message : error.message})
    try {

    const query = `
      SELECT orders.amount AS order_amount, book.amount AS book_amount, book.id AS book_id,
      orders.status as status 
      FROM orders 
      INNER JOIN book ON book.id = orders.book_id 
      WHERE orders.id = $1
    `;
    const { rows } = await pool.query(query, [orderId]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Order not found" });
    }
    if(rows[0].status == 'accepted') 
      return res.status(400).json({ message: "Buyurtma berilgan" });

    const { order_amount, book_amount, book_id } = rows[0];

    if (book_amount >= order_amount) {
      const updateBookQuery = `
        UPDATE book
        SET amount = amount - $1
        WHERE id = $2
      `;
      await pool.query(updateBookQuery, [order_amount, book_id]);

      const updateOrderQuery = `
        UPDATE orders
        SET status = 'accepted'
        WHERE id = $1
      `;
      await pool.query(updateOrderQuery, [orderId]);

      res
        .status(200)
        .json({ message: "Order accepted and book stock updated" });
    } else {
      const updateOrderQuery = `
        UPDATE orders
        SET status = 'rejected'
        WHERE id = $1
      `;
      await pool.query(updateOrderQuery, [orderId]);

      res
        .status(200)
        .json({ message: "Order rejected due to insufficient stock" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the order" });
  }
});

export default router;

/**
 * @swagger
 * /api/admin/editOrder/{orderId}:
 *   put:
 *     summary: Update the status of an order based on stock availability
 *     description: Checks the stock for the book in the order. If the stock is sufficient, the order is accepted and the stock is updated. If stock is insufficient, the order is rejected.
 *     tags:
 *       - admin order
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The ID of the order to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order status successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message indicating the result of the operation.
 *       400:
 *         description: Invalid order ID, order not found, or order already accepted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: An error occurred while processing the order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the issue.
 */