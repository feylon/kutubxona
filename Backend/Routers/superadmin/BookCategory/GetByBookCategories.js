// URL = http://localhost:4100/api/superadmin/BookCategory/GetByBookCategories
import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const Schema = Joi.object({ id: Joi.string().required().uuid() });

const router = Router();

router.get("/", verify, async (req, res) => {
  const checkSchema = Schema.validate(req.query);
  const { error, value } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });
  let { id } = value;

  try {
    let data = await pool.query(
      "SELECT id, name FROM bookcategory WHERE id = $1",
      [id]
    );
    
    if (data.rows.length === 0) {
      return res.status(404).send({ error: "Mavjud emas" });
    }
    
    return res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});

export default router;
/**
 * @swagger
 * /api/superadmin/BookCategory/GetByBookCategories:
 *   get:
 *     tags:
 *       - Super-admin-BookCategory
 *     summary: Get details of a book category
 *     description: This endpoint allows a Super Admin to retrieve the details of a book category by providing its `id`.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The unique identifier (UUID) of the book category to retrieve.
 *         schema:
 *           type: string
 *           example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *     responses:
 *       200:
 *         description: Book category found successfully
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
 *         description: Invalid request, `id` must be a valid UUID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "id must be a valid UUID"
 *       404:
 *         description: Book category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book category not found"
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
