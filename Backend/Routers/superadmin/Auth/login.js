// URL http://localhost:4100/api/superadmin/login tags Super admin auth
import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { sign } from "../../../functions/jwt_super_admin.js";
import { check_hash } from "../../../functions/bcrypt.js";
const router = Router();
const Schema = Joi.object({
    login : Joi.string().min(3).max(15).required(),
    password  :Joi.string().min(3).required()
})
router.post("/", async (req, res, next)=>{
 const checkSchema = Schema.validate(req.body);
 if(checkSchema.error) return   res.status(400).send({error : checkSchema.error.message});
let {login, password} = checkSchema.value;
login = login.toLowerCase().trim() 

try {
    const data = await pool.query(`Select id, password from super_admin where username = $1`, [login])
    if(data.rows.length === 0) return res.status(402).send({error : "Foydalanuvchi topilmadi"});
    const passwordRow = data.rows[0].password;
    const {id} = data.rows[0];
    if(check_hash(password, passwordRow)){
        console.log(id)
       let token =  await sign(id);
       return res.status(201).send({token})
    }
    else {
        return res.status(402).send({error : "Parol xato"})
    }
} catch (error) {
    res.status(500).send({error : "Serverda xatolik mavjud"})
    console.log(error)
}


})
export default router;
/**
 * @swagger
 * /api/superadmin/login:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Super Admin Login
 *     description: Authenticates the super admin using a username and password and returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: The username of the super admin.
 *                 minLength: 3
 *                 maxLength: 15
 *               password:
 *                 type: string
 *                 description: The password of the super admin.
 *                 minLength: 3
 *             required:
 *               - login
 *               - password
 *           example:
 *             login: "superadmin"
 *             password: "securepassword123"
 *     responses:
 *       201:
 *         description: Successfully authenticated and returned the token.
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error in the input data.
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 *       401:
 *         description: Unauthorized - Incorrect login or password.
 *         content:
 *           application/json:
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "Foydalanuvchi topilmadi"
 *               incorrectPassword:
 *                 summary: Incorrect password
 *                 value:
 *                   error: "Parol xato"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Serverda xatolik mavjud"
 */
