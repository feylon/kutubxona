// url http://localhost:4100/api/superadmin/admin/getadmin/ tags - Super Admin
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";



const router = Router();
router.get("/", verify, async (req, res) => {
try {
    const data = await pool.query("Select id, fullname, username,created_at, status from admin");
    return res.status(200).send(data.rows)
} catch (error) {
    res.status(500).send({error : "Server Error"})
    console.log(error)
}
});
export default router;

/**
 * @swagger
 * /api/superadmin/admin/getadmin:
 *   get:
 *     tags:
 *       - Super Admin
 *     summary: Retrieve a list of all admins
 *     description: This endpoint returns a list of all admins with their ID, fullname, username, created_at, and status.
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the admin.
 *                   fullname:
 *                     type: string
 *                     description: The full name of the admin.
 *                   username:
 *                     type: string
 *                     description: The username of the admin.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the admin was created.
 *                   status:
 *                     type: string
 *                     description: The current status of the admin (active, inactive, etc.)
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
