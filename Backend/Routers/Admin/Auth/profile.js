import { verify } from "../../../functions/jwt_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", verify, async (req, res, next) => {
  const {id} = req;
  try {
    const data = await pool.query(`
        Select fullname, username from admin where id = $1;
        `, [id]);
     return res.status(200).send({data : data.rows[0], role: "Admin"});

  } catch (error) {
    res.status(500).send({error : "Server error"});
    console.log(error)
  }
});
export default router;
/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Admin Details
 *     description: Fetches the details of the currently authenticated admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved admin details.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 fullname: "John Doe"
 *                 username: "adminuser"
 *               role: "Admin"
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server error"
 */
