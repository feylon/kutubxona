import { Router } from 'express';
import Joi from 'joi';
import pool from '../../../functions/database.js';
import { verify } from '../../../functions/jwt_user.js';
const router = Router();
router.get('/', verify, async (req, res) => {
    const { id: users_id } = req; // User ID from token
  
    try {
      // Fetch orders for the user
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
where orders.users_id = $1
order by b.price`,
        [users_id]
      );
  
      res.status(200).send({
        orders: ordersResult.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server xato' });
    }
  });
export default router;