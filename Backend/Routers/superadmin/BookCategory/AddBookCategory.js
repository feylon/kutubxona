// http://localhost:4100/api/superadmin/BookCategory/AddBookCategory TAGS : Super-admin-BookCategory 
import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const Schema = Joi.object({ name: Joi.string().min(3).required() });

const router = Router();
router.post("/", verify, async (req, res) => {
  const checkSchema = Schema.validate(req.body);
  const { error, value } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });
  let { name } = value;
  try {
      name = name.toLowerCase();
    let data = await pool.query(
      "insert into BookCategory (name) values ($1) returning id, name",
      [name]
    );
    return res.status(201).send(data.rows[0]);
  } catch (error) {
    if (error.code == "23505")
      return res
        .status(400)
        .send({ error: `'${name}' allaqachon yaratilgan` });
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});
export default router;

/**
 * @swagger
 * /api/superadmin/BookCategory/AddBookCategory:
 *   post:
 *     tags:
 *       - Super-admin-BookCategory
 *     summary: Add a new book category
 *     description: This endpoint allows a Super Admin to add a new book category to the database. The name of the category is converted to lowercase before being stored.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new book category.
 *                 example: "adabiyot"
 *     responses:
 *       201:
 *         description: Book category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the book category.
 *                   example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *                 name:
 *                   type: string
 *                   description: The name of the book category.
 *                   example: "adabiyot"
 *       400:
 *         description: Invalid request body or category already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "'adabiyot' allaqachon yaratilgan"
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
