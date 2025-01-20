import JWT from "jsonwebtoken";
import { configDotenv } from "dotenv";
import pool from "./database.js";
configDotenv();

async function sign(id) {
  const payload = { id };

  const expiresIn = "4h";
  const token = JWT.sign(payload, process.env.JWTADMIN, { expiresIn });

  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

  await pool.query(
    "INSERT INTO jwt_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [id, token, expiresAt]
  );

  return token;
}

async function verify(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token yo'q" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const result = await pool.query(
      "SELECT * FROM jwt_tokens WHERE token = $1",
      [token]
    );

    if (!result.rows.length) {
      return res.status(403).json({ message: "Xato yoki token eskirdi" });
    }

    const dbToken = result.rows[0];

    if (new Date() > new Date(dbToken.expires_at)) {
      return res.status(403).json({ message: "Token eskirdi" });
    }

    const decoded = JWT.verify(token, process.env.JWTADMIN);
    req.id = decoded.id;

    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Token verification failed" });
  }
}
export { sign, verify };
