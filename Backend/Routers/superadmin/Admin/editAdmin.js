// URL http://localhost:4100/api/superadmin/editadmin/ed2d6737-bb08-457f-a09f-b5534ad3001f
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";
const router = Router();
const Schema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .required()
});
router.patch("/:id", verify, async (req, res) => {
  const SchemaID = Joi.object({ id: Joi.string().uuid().required() });
  const checkSchemaID = SchemaID.validate(req.params);
  if (checkSchemaID.error)
    return res.status(400).send({ error: checkSchemaID.error.message });
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let { fullname, username, status } = checkSchema.value;
  fullname = fullname.trim();
  username = username.toLocaleLowerCase().trim();
  let { id } = checkSchemaID.value;
  try {
    const data = await pool.query(
      `
           Update admin set fullname = $1, username = $2 where  id = $3 returning fullname, username, status;
            `,
      [fullname, username,  id]
    );

    res.status(201).send({ message: "Edited :)", data: data.rows[0] });
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
 * /api/superadmin/editadmin/{id}:
 *   patch:
 *     tags:
 *       - Super Admin
 *     summary: Edit Admin Details
 *     description: Allows the super admin to edit the details of an existing admin by providing a valid admin ID and updated data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the admin to be edited.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the admin.
 *                 minLength: 3
 *                 maxLength: 50
 *               username:
 *                 type: string
 *                 description: Admin username. Must start with a letter and can include letters, numbers, and underscores.
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: "^[a-zA-Z][a-zA-Z0-9_]*$"
 *             required:
 *               - fullname
 *               - username
 *           example:
 *             fullname: "Jane Doe"
 *             username: "janedoe_admin"
 *     responses:
 *       201:
 *         description: Successfully updated the admin details.
 *         content:
 *           application/json:
 *             example:
 *               message: "Edited :)"
 *               data:
 *                 fullname: "Jane Doe"
 *                 username: "janedoe_admin"
 *                 status: true
 *       400:
 *         description: Validation error or duplicate username.
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Validation error
 *                 value:
 *                   error: "Validation error message"
 *               duplicateUsername:
 *                 summary: Duplicate username
 *                 value:
 *                   error: "'janedoe_admin' allaqachon yaratilgan"
 *       404:
 *         description: Admin with the given ID not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Admin not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server Error"
 */
