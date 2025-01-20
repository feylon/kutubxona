// URL http://localhost:4100/api/superadmin/addadmin 
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";
import { hash } from "../../../functions/bcrypt.js";
const router = Router();
const Schema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/).required(),
  password: Joi.string().min(3).max(50).required(),
  status: Joi.boolean().required(),
});
router.post("/", [verify], async (req, res) => {
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  let { fullname, username, password, status } = checkSchema.value;
  fullname = fullname.trim();
  password = hash(password);
  username = username.toLocaleLowerCase().trim();
  try {
    const data = await pool.query(
      `
        insert into admin (fullname, username, password, status) values
        ($1, $2, $3, $4) returning fullname, username, status;
        `,
      [fullname, username, password, status]
    );
    
    res.status(201).send({ message: "Created :)", data : data.rows[0] });
  } catch (error) {
    if(error.code == "23505") return res.status(400).send({error : `'${username}' allaqachon yaratilgan`})
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});
export default router;
/**
 * @swagger
 * /api/superadmin/addadmin:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Add a New Admin
 *     description: Allows the super admin to add a new admin by providing the required details.
 *     security:
 *       - bearerAuth: []
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
 *               password:
 *                 type: string
 *                 description: Password for the admin.
 *                 minLength: 3
 *                 maxLength: 50
 *               status:
 *                 type: boolean
 *                 description: Status of the admin (active or inactive).
 *             required:
 *               - fullname
 *               - username
 *               - password
 *               - status
 *           example:
 *             fullname: "John Doe"
 *             username: "johndoe_admin"
 *             password: "securepassword123"
 *             status: true
 *     responses:
 *       201:
 *         description: Successfully created the admin.
 *         content:
 *           application/json:
 *             example:
 *               message: "Created :)"
 *               data:
 *                 fullname: "John Doe"
 *                 username: "johndoe_admin"
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
 *                   error: "'johndoe_admin' allaqachon yaratilgan"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server Error"
 */
