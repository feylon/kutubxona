import { Router } from "express";
import { verify } from "../../../functions/jwt_super_admin.js";
import Joi from "joi";
import pool from "../../../functions/database.js"; 

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
            SELECT DISTINCT
                users.id AS user_id,
                users.fullname AS fullname,
                users.username AS username,
                users.created_at AS created_at,
                COALESCE((
                    SELECT 
                        SUM(orders.amount)
                    FROM 
                        orders
                    WHERE 
                        orders.users_id = users.id 
                        AND orders.status = 'accepted'
                ), 0) AS total_amount
            FROM 
                users
            LEFT JOIN 
                orders ON orders.users_id = users.id
            ORDER BY users.created_at DESC
            LIMIT $1 OFFSET $2
        `;

    const { rows } = await pool.query(query, [limit, offset]);

    const countQuery = `SELECT COUNT(*) AS total_users FROM users`;
    const countResult = await pool.query(countQuery);
    const totalUsers = parseInt(countResult.rows[0].total_users, 10);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Tizimda muommo bor." });
  }
});

export default router;
