// URL http://localhost:4100/api/admin/getOrdersByCondition?status=accepted tags : admin order 
import Joi from "joi";
import { Router } from "express";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_admin.js";
const router = Router();

router.get('/', verify, async (req, res) => {
  try {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1),  
      limit: Joi.number().integer().min(1).default(10), 
      status: Joi.string().valid('pending', 'accepted', 'rejected').required()
    });
    let checkSchema = schema.validate(req.query);
    let {error} = checkSchema;
    if(error) return res.status(400).send({error : error.message});

    const { page, limit, status } = await schema.validateAsync(req.query);

    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        orders.id AS order_id,
        orders.accept AS accept,
        orders.amount AS amount,
        orders.created_at AS created_at,
        orders.status AS status,
        users.fullname AS fullname,
        book.price AS price,
        book.name AS name,
      (Select b.amount from book b where b.id = orders.book_id ) asbook_count, 
        book.price * orders.amount AS summ
      FROM orders
      INNER JOIN book ON book.id = orders.book_id
      INNER JOIN users ON users.id = orders.users_id
      where orders.status = $3
      order by orders.created_at desc
      LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await pool.query(query, [limit, offset, status]);

    const countQuery = `
      SELECT COUNT(*) 
      FROM orders
      INNER JOIN book ON book.id = orders.book_id
      INNER JOIN users ON users.id = orders.users_id
      where orders.status = $1
    `;
    
    const countResult = await pool.query(countQuery, [status]);
    const totalRecords = parseInt(countResult.rows[0].count);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xato" });
  }
});

export default router;
/**
 * @swagger
 * /api/admin/getOrdersByCondition:
 *   get:
 *     tags:
 *       - admin order
 *     summary: Get orders by status with pagination
 *     description: Fetch orders filtered by their status, with support for pagination.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Filter orders by their status.
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *         description: The page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A list of orders and pagination details.
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
 *                       order_id:
 *                         type: string
 *                         format: uuid
 *                         example: "41dd41a1-9538-4b8d-947e-16340a8cbc1f"
 *                       accept:
 *                         type: boolean
 *                         example: true
 *                       amount:
 *                         type: integer
 *                         example: 2
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-27T18:17:06.353Z"
 *                       status:
 *                         type: string
 *                         example: "accepted"
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       price:
 *                         type: string
 *                         format: decimal
 *                         example: "15.50"
 *                       summ:
 *                         type: string
 *                         format: decimal
 *                         example: "31.00"
 *                       name:
 *                         type: string
 *                         example: "Book Title"
 *                       asbook_count:
 *                         type: integer
 *                         example: 10
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalRecords:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid input or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "status is required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server xato"
 */
