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
    return   res.status(404).send({ error: "Buyutma topilmadi" });
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
