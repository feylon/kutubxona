// path : http://localhost:4100/api/superadmin/book/deleteBook/81431b4d-667d-49e4-b05d-ae70de9e10c5 Super-admin-Book

import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const Schema = Joi.object({
  id: Joi.string().uuid().required(),
});

const router = Router();
router.delete("/:id", verify, async (req, res) => {
  const checkSchema = Schema.validate(req.params);
  const { error, value } = checkSchema;
  if (error) return res.status(400).send({ error: error.message });
  const { id } = value;
  try {
    const data = await pool.query("delete from book where id = $1", [id]);
    return res.status(200).send({ message: "Deleted true" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;


/**
 * @swagger
 * /api/superadmin/book/deleteBook/{id}:
 *   delete:
 *     tags:
 *       - Super-admin-Book
 *     summary: Delete a book
 *     description: Allows a Super Admin to delete a book from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier (UUID) of the book to be deleted.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "81431b4d-667d-49e4-b05d-ae70de9e10c5"
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted true"
 *       400:
 *         description: Bad Request - Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid UUID format"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
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
