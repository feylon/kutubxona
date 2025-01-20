import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";
const router = Router();
const Schema = Joi.object({
  status: Joi.boolean().required(),
});
router.post("/:id", [verify], async (req, res) => {
  const SchemaID = Joi.object({ id: Joi.string().uuid().required() });
  const checkSchemaID = SchemaID.validate(req.params);
  if (checkSchemaID.error)
    return res.status(400).send({ error: checkSchemaID.error.message });
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let { status } = checkSchema.value;
  let { id } = checkSchemaID.value;

  try {
    const data = await pool.query(
      `
        Update users set status = $1 where id = $2;
        `,
      [status, id]
    );
    if(!status)
    { const data1 = await pool.query(
      `
          Delete from jwt_tokens where user_id = $1
          `,
      [id]
    );}
    res.status(201).send({ message: "Changed :)", data: data.rows[0] });
  } catch (error) {
    if (error.code == "23505")
      return res
        .status(400)
        .send({ error: `'${username}' allaqachon yaratilgan` });
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});
export default router;
