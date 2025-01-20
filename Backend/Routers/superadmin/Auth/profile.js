// URL http://localhost:4100/api/superadmin/profile tags : - Super Admin
import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", verify, async (req, res, next) => {
    const {id} = req;
    try {
      const data = await pool.query(`
          Select fullname, username from super_admin where id = $1;
          `, [id]);
       return res.status(200).send({data : data.rows[0], role: "Super Admin"});
  
    } catch (error) {
      res.status(500).send({error : "Server error"});
      console.log(error)
    }
});
export default router;
/**
 * @swagger
 * /api/superadmin/profile:
 *   get:
 *     tags:
 *       - Super Admin
 *     summary: Retrieve Super Admin Profile
 *     description: Allows a Super Admin to retrieve their profile information, including their full name and username.
 *     responses:
 *       200:
 *         description: Profile information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                       description: Full name of the Super Admin.
 *                       example: "John Doe"
 *                     username:
 *                       type: string
 *                       description: Username of the Super Admin.
 *                       example: "superadmin123"
 *                 role:
 *                   type: string
 *                   description: Role of the user.
 *                   example: "Super Admin"
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
