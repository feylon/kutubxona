// URL http://localhost:4100/api/superadmin/users/getusers SUPER_ADMIN_USERS 
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";
import Joi from "joi";



const router = Router();
router.get("/", verify, async (req, res) => {
try {
    const data = await pool.query("Select id, fullname, username,created_at, status from users");
    return res.status(200).send(data.rows)
} catch (error) {
    res.status(500).send({error : "Server Error"})
    console.log(error)
}
});

export default router;
/**
 * @swagger
 * /api/superadmin/users/getusers:
 *   get:
 *     tags:
 *       - SUPER_ADMIN_USERS
 *     summary: Retrieve a list of all users
 *     description: This endpoint returns a list of all users with their ID, fullname, username, created_at, and status.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the user.
 *                   fullname:
 *                     type: string
 *                     description: The full name of the user.
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the user was created.
 *                   status:
 *                     type: string
 *                     description: The current status of the user (active, inactive, etc.)
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
