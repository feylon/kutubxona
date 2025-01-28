// URL http://localhost:4100/api/admin/getorder?limit=2&page=1 tags : admin order 
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
    });
    let checkSchema = schema.validate(req.query);
    let {error} = checkSchema;
    if(error) return res.status(400).send({error : error.message});

    const { page, limit } = await schema.validateAsync(req.query);

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
      LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await pool.query(query, [limit, offset]);

    const countQuery = `
      SELECT COUNT(*) 
      FROM orders
      INNER JOIN book ON book.id = orders.book_id
      INNER JOIN users ON users.id = orders.users_id
    `;
    
    const countResult = await pool.query(countQuery);
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
 * /api/admin/getorder:
 *   get:
 *     summary: Get paginated orders
 *     description: Fetch a list of orders with pagination support. Returns the orders with the total count and pagination info.
 *     tags:
 *       - admin order
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of orders with pagination information.
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
 *                         type: integer
 *                         description: The ID of the order.
 *                       accept:
 *                         type: boolean
 *                         description: Whether the order was accepted.
 *                       amount:
 *                         type: integer
 *                         description: The amount of the order.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the order was created.
 *                       status:
 *                         type: string
 *                         description: The status of the order.
 *                       fullname:
 *                         type: string
 *                         description: Full name of the user who placed the order.
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Price of the book.
 *                       summ:
 *                         type: number
 *                         format: float
 *                         description: Total sum (price * amount).
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                     limit:
 *                       type: integer
 *                       description: The number of records per page.
 *                     totalRecords:
 *                       type: integer
 *                       description: The total number of records available.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages based on limit.
 *       400:
 *         description: Invalid query parameters (e.g., invalid `page` or `limit`).
 *       500:
 *         description: Internal server error.
 */