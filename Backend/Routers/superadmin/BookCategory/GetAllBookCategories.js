// URL = http://localhost:4100/api/superadmin/BookCategory/GetAllBookCategories
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";

const router = Router();

router.get("/", verify, async (req, res) => {
  try {
    let data = await pool.query("SELECT id, name FROM bookcategory");

    if (data.rows.length === 0) {
      return res.status(404).send({ error: "Mavjud emas" });
    }

    return res.status(200).send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});

export default router;
/**
 * @swagger
 * /api/superadmin/BookCategory/GetAllBookCategories:
 *   get:
 *     tags:
 *       - Super-admin-BookCategory
 *     summary: Get all book categories
 *     description: This endpoint allows a Super Admin to retrieve all book categories from the database.
 *     responses:
 *       200:
 *         description: A list of all book categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the book category.
 *                     example: "e02b9f29-98f3-4b56-81d1-4e41d8f9375e"
 *                   name:
 *                     type: string
 *                     description: The name of the book category.
 *                     example: "adabiyot"
 *       404:
 *         description: No book categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No book categories found"
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
