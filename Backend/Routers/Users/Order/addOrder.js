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
