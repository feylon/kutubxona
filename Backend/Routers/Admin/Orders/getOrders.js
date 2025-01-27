import Joi from "joi"
import {Router} from "express"
import pool from "../../../functions/database.js";
import {verify} from "../../../functions/jwt_admin.js";
const router = Router();

router.get('/',  async (req, res)=>{
res.send("salom")
});

export default router;