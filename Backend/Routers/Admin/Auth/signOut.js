import pool from "../../../functions/database.js";
import { Router } from "express";
import { verify } from "../../../functions/jwt_admin.js";
const router = Router();
router.get("/", verify, async function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ message: "Token yo'q" });
  }
    const token = authHeader.split(" ")[1];
    console.log(token)
    try {
      const result = await pool.query("DELETE FROM jwt_tokens WHERE token = $1", [token]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Token topilmadi yoki allaqachon o'chirilgan" });
      }
  
      res.status(200).json({ message: "Muvaffaqiyatli tizimdan chiqildi" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Tokenni o'chirishda xatolik yuz berdi" });
    }
  })

export default router;

/**
 * @swagger
 * /api/admin/signOut:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Admin Logout
 *     description: Logs out the admin by deleting the provided JWT token from the database.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             example:
 *               message: "Muvaffaqiyatli tizimdan chiqildi"
 *       400:
 *         description: Token not provided in the request header.
 *         content:
 *           application/json:
 *             example:
 *               message: "Token yo'q"
 *       404:
 *         description: Token not found or already deleted.
 *         content:
 *           application/json:
 *             example:
 *               message: "Token topilmadi yoki allaqachon o'chirilgan"
 *       500:
 *         description: Error occurred while deleting the token.
 *         content:
 *           application/json:
 *             example:
 *               message: "Tokenni o'chirishda xatolik yuz berdi"
 */
