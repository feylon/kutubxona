// URL http://localhost:4100/api/users/book/addorder
import { Router } from 'express';
import Joi from 'joi';
import pool from '../../../functions/database.js';
import { verify } from '../../../functions/jwt_user.js';

const router = Router();

const orderSchema = Joi.object({
  book_id: Joi.string().uuid().required(), 
  amount: Joi.number().integer().positive().required(), 
  status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'), 
  active: Joi.boolean().default(false),
  accept: Joi.boolean().default(false) 
});

router.post('/', verify, async (req, res) => {
  const { id: users_id } = req; 
  const { book_id, amount, status, active, accept } = req.body;

  const { error } = orderSchema.validate({ book_id, amount, status, active, accept });
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const result = await pool.query(
      `INSERT INTO orders (users_id, book_id, amount, status, active, accept)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [users_id, book_id, amount, 'pending', false, false]
    );

    const newOrder = result.rows[0];
    res.status(201).send({
      message: 'Order yaratildi',
      order: newOrder
    });
  } catch (error) {
    if (error.code == "23503") return res.status(400).send({error:`'${book_id}' jadvalda topilmadi`})
    console.error(error);
    res.status(500).send({ error: 'Server xato' });
  }
});

export default router;

/**
 * @swagger
 * /api/users/book/addorder:
 *   post:
 *     summary: Create a new order for a book
 *     tags:
 *       - Orders USER
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the book to order
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               amount:
 *                 type: integer
 *                 description: The quantity of the book to order
 *                 example: 3
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 description: The status of the order
 *                 example: "pending"
 *               active:
 *                 type: boolean
 *                 description: Whether the order is active
 *                 example: false
 *               accept:
 *                 type: boolean
 *                 description: Whether the order is accepted
 *                 example: false
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order yaratildi"
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: The UUID of the newly created order
 *                       example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of when the order was created
 *                       example: "2025-01-01T10:00:00Z"
 *       400:
 *         description: Validation or foreign key error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "'d290f1ee-6c54-4b01-90e6-d701748f0851' jadvalda topilmadi"
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
