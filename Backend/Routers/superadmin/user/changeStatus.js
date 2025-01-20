// URL = http://localhost:4100/api/superadmin/users/changestatus/0213aba2-f3c9-4a27-9a82-5a5954e7516a 
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
/**
 * @swagger
 * /api/superadmin/users/changestatus/{id}:
 *   post:
 *     tags:
 *       - SUPER_ADMIN_USERS
 *     summary: Change the status of a user
 *     description: This endpoint allows a Super Admin to change the status of a user (active/inactive). If the status is set to `false`, the user's JWT tokens will be deleted as well.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier (UUID) of the user whose status is to be changed.
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: body
 *         name: status
 *         description: The status to be set for the user (true for active, false for inactive).
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *               description: User's new status.
 *               example: true
 *     responses:
 *       201:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Changed :)"
 *                 data:
 *                   type: object
 *                   description: The updated user data (if any changes were made).
 *       400:
 *         description: Invalid request body or path parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "status is required" 
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server Error"
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
