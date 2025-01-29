import Joi from "joi";
import { Router } from "express";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_super_admin.js";
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
