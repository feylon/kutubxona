import { Router } from "express";
import pool from "../../../functions/database.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM book) AS books,
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM orders WHERE status = 'accepted') AS orders;
    `);

    
    res.send(data.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;