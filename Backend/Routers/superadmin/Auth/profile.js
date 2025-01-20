import { verify } from "../../../functions/jwt_super_admin.js";
import pool from "../../../functions/database.js";
import { Router } from "express";

const router = Router();

router.get("/", verify, async (req, res, next) => {
    console.log(req.id)
    res.status(200).send({data: "I'm working"})
});
export default router;
