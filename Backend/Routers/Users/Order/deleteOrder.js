import { Router } from 'express';
import Joi from 'joi';
import pool from '../../../functions/database.js';
import { verify } from '../../../functions/jwt_user.js';
const router = Router();
router.delete('/:orderId', verify, async (req, res) => {
    const { id: users_id } = req; // User ID from token
    const { orderId } = req.params; // Order ID from the URL
  
    try {
      // Check if the order exists and belongs to the user
      const orderCheck = await pool.query(
        `SELECT id FROM orders WHERE id = $1 AND users_id = $2`,
        [orderId, users_id]
      );
  
      if (orderCheck.rows.length === 0) {
        return res.status(404).send({ error: 'Order not found or you do not have access' });
      }
  
      // Delete the order
      await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
      res.status(200).send({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to delete order' });
    }
  });