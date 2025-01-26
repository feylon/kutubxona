// http://localhost:4100/api/users/book/deleteOrder/da74eb8c-448e-42b3-b3f8-2492ddcde1f1
import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_user.js";
const router = Router();
router.delete("/:orderId", verify, async (req, res) => {
  const { id: users_id } = req;
  const { orderId } = req.params;
  const Schema = Joi.string().uuid().required();
  const checkSchema = Schema.validate(orderId);
  const { error } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });
  try {
    const orderCheck = await pool.query(
      `SELECT id, accept FROM orders WHERE id = $1 AND users_id = $2 limit 1`,
      [orderId, users_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).send({ error: "Mavjud emas" });
    }
    if (orderCheck.rows[0].accept) {
      return res.status(400).send({
        error: "Admin tomonidan tasdiqlangan. O'chirish mumkin emas.",
      });
    }
    await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
    res.status(200).send({ message: "Buyurtma o`chirildi" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Serverda muommo chiqdi" });
  }
});
export default router;
