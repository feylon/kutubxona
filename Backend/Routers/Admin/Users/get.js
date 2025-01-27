import { Router } from "express";
import pool from "../../../functions/database.js";
import Joi from "joi";
import { verify } from "../../../functions/jwt_admin.js";
const router = Router();

const schema = Joi.object({
  page: Joi.number().integer().min(1).default(1),  
  limit: Joi.number().integer().min(1).default(10),
});

router.get("/", verify, async (req, res) => {
  try {
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).send({ message: error.message });

    const { page, limit } = value;

    const offset = (page - 1) * limit;

    const query = `
      SELECT id, fullname, username, status, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await pool.query(query, [limit, offset]);

    const countQuery = `SELECT COUNT(*) FROM users`;
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
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
});

export default router;
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users with pagination
 *     description: This endpoint retrieves a paginated list of users, including their `id`, `fullname`, `username`, `status`, and `created_at`.
 *     tags:
 *       - admin
 *       - users
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - name: limit
 *         in: query
 *         description: The number of users to retrieve per page.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *     responses:
 *       200:
 *         description: A list of users with pagination information.
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
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       fullname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalRecords:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request, validation failed for `page` or `limit` query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing the validation issue.
 *       500:
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating a server issue.
 */
