// URL http://localhost:4100/api/users/book/EditOrder
import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_user.js";

const router = Router();

router.patch("/", verify, async (req, res) => {
  const Schema = Joi.object({
    id: Joi.string().uuid().required(),
    amount: Joi.number().min(0).required(),
  });

  const checkSchema = Schema.validate(req.body);
  const { error, value } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });

  const { id, amount } = value;
  try {
    const data = await pool.query(
      `Select 
active, 
amount,
accept 
from orders 
where id = $1  and users_id = $2`,
      [id, req.id]
    );
    if (data.rows.length == 0)
    return   res.status(404).send({ error: "Buyurtma topilmadi" });
    if (data.rows.length === 0) {
      return res.status(404).send({ error: "Mavjud emas" });
    }

    if (data.rows[0].accept) {
      return res.status(400).send({
        error: "Admin tomonidan tasdiqlangan. tahrirlash mumkin emas.",
      });
    }
    
          const update = await pool.query(
            `Update orders set amount = $1 where users_id = $2 and id = $3 returning amount`,
            [amount, req.id, id]
          );
          res.status(200).send({message : update.rows[0].amount})
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Serverda muommo bor" });
  }
});

export default router;
/**
 * @swagger
 * /api/users/book/EditOrder:
 *   patch:
 *     summary: Edit the quantity of an existing order
 *     tags:
 *       - Orders USERS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the order to update
 *                 example: "a9af5539-7f74-40b2-892a-406d8ff67362"
 *               amount:
 *                 type: integer
 *                 description: The new quantity of the order
 *                 example: 5
 *             required:
 *               - id
 *               - amount
 *     responses:
 *       200:
 *         description: Successfully updated the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: integer
 *                   description: The updated quantity of the order
 *                   example: 5
 *       400:
 *         description: Validation error or order cannot be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin tomonidan tasdiqlangan. tahrirlash mumkin emas."
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Buyurtma topilmadi"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Serverda muommo bor"
 */
