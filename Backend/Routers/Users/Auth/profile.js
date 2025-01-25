// URL http://localhost:4100/api/users/profile tag AUTH_USER
import { verify } from "../../../functions/jwt_user.js";
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", verify, async (req, res, next) => {
  const { id } = req;
  try {
    const data = await pool.query(
      `
          Select fullname, username from users where id = $1;
          `,
      [id]
    );
    return res.status(200).send({ data: data.rows[0], role: "Foydalanuvchi" });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
    console.log(error);
  }
});
export default router;
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - AUTH_USER
 *     summary: Retrieve the profile information of the authenticated user
 *     description: Fetches the user's fullname and username based on the user ID from the JWT token
 *     responses:
 *       200:
 *         description: Successful response with user data
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
 *                       description: The full name of the user
 *                     username:
 *                       type: string
 *                       description: The username of the user
 *                 role:
 *                   type: string
 *                   example: "Foydalanuvchi"
 *       500:
 *         description: Server error
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
