import { Router } from 'express';
import Joi from 'joi';
import pool from '../../../functions/database.js';
import { verify } from '../../../functions/jwt_user.js';
const router = Router();

router.put('/:orderId', verify, async (req, res) => {
    const { id: users_id } = req; // User ID from token
    const { orderId } = req.params; // Order ID from the URL
    const { book_id, amount, status, active, accept } = req.body;
  
    // Validate request body using Joi
    const { error } = orderSchema.validate({ book_id, amount, status, active, accept });
    if (error) return res.status(400).send({ error: error.details[0].message });
  
    try {
      // Check if the order exists and belongs to the user
      const orderCheck = await pool.query(
        `SELECT id FROM orders WHERE id = $1 AND users_id = $2`,
        [orderId, users_id]
      );
  
      if (orderCheck.rows.length === 0) {
        return res.status(404).send({ error: 'Order not found or you do not have access' });
      }
  
      // Update the order
      const result = await pool.query(
        `UPDATE orders 
         SET book_id = $1, amount = $2, status = $3, active = $4, accept = $5 
         WHERE id = $6 RETURNING id, book_id, amount, status, active, accept`,
        [book_id, amount, status, active, accept, orderId]
      );
  
      const updatedOrder = result.rows[0];
      res.status(200).send({
        message: 'Order updated successfully',
        order: updatedOrder
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to update order' });
    }
  });