// URL http://localhost:4100/api/admin/changeorder/41dd41a1-9538-4b8d-947e-16340a8cbc1f/rejected tags : admin order
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_admin.js";
import Joi from "joi";
import { Router } from "express";
const router = Router();

router.put("/:orderId/:status", verify, async (req, res) => {
  const Schema = Joi.object({
    orderId: Joi.string().required().uuid(),
    status: Joi.string().required().valid("pending", "rejected", "accepted"),
  });
  let checkSchema = Schema.validate(req.params);
  let { error } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });
  const { orderId, status } = await Schema.validateAsync(req.params);
  try {
    const count = await pool.query(`select  status from orders where id = $1`, [
      orderId,
    ]);
    if (count.rows.length === 0)
      return res.status(400).json({ message: "Buyurtma topilmadi" });
    if (count.rows[0].status == 'accepted')
        return res.status(400).json({ error: "Buyurtma yuborilgan" });
    const data = await pool.query(
      `update orders set status =$2 where id = $1 returning status`,
      [orderId, status]
    );
    res
      .status(200)
      .json({ message: "Order status updated", data: data.rows[0] });
  } catch (error) {
    console.error(error);
  }
});

export default router;
/**
 * @swagger
 * /api/admin/changeorder/{orderId}/{status}:
 *   put:
 *     tags:
 *       - admin order
 *     summary: Change the status of an order
 *     description: Update the status of an order by its ID. Only valid statuses are "pending" and "rejected."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the order to update.
 *       - name: status
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, rejected]
 *         description: The new status for the order.
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order status updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "rejected"
 *       400:
 *         description: Invalid input or order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Buyurtma topilmadi"
 *                 error:
 *                   type: string
 *                   example: "Invalid UUID format"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the order status."
 */
