import pool from "../../../functions/database.js";
import { verify } from "../../../functions/jwt_admin.js";
import Joi from "joi";
import {Router} from "express";
const router = Router();

router.put("/:orderId/:status", verify, async (req, res) => {
const Schema = Joi.object(
{
  orderId: Joi.string().required().uuid(),
  status: Joi.string().required().valid("pending", "rejected"),
});
let checkSchema = Schema.validate(req.params);
let {error} = checkSchema;
if(error) return res.status(400).send({error : error.message});
const {orderId, status} = await Schema.validateAsync(req.params);
try {
    const count = await pool.query(`select * from orders where id = $1`, [orderId]);
    if(count.rows.length === 0) return res.status(400).json({message: "Buyurtma topilmadi"});
const data = await pool.query(`update orders set status =$2 where id = $1 status`, [orderId, status]);
res.status(200).json({message: "Order status updated", data: data.rows[0]});
}
catch (error) {
console.error(error);
}

});


export default router;