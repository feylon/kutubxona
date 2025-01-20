// path : http://localhost:4100/api/superadmin/book/UploadPics/fe397600-01a7-4021-9797-931e8052df5e
import Joi from "joi";
import { verify } from "../../../functions/jwt_super_admin.js";
import { Router } from "express";
import pool from "../../../functions/database.js";
import path from "path";
import fs from "fs";
import md5 from "md5";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/Pictures/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${md5(Date.now().toString())}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("FAQAT RASM BULSIN"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

router.post("/:id", verify, async (req, res) => {
  try {
    const Schema = Joi.object({
      id: Joi.string().uuid().required(),
    });
    const checkSchema = Schema.validate(req.params);
    const { error } = checkSchema;
    if (error) return res.status(400).send({ error: error.message });
    const data = await pool.query(
      `SELECT id FROM book WHERE id = $1`,
      [req.params.id]
    );
    if (data.rows.length === 0) {
      return res.status(404).send({ error: "Book mavjud emas" });
    }
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(404).send({ error: "Book mavjud emas" });
    }
    console.log(error);
    return res.status(500).send({ error: "Server error, [search] 🤢🤢🤢🤔" });
  }

  upload.single("file")(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({ error: "Max size 4 MB" });
      }
      if (err.message === "FAQAT RASM BULSIN") {
        return res.status(400).send({ error: err.message });
      }
      console.log(err);
      return res.status(500).send({ error: "Server error 🤢🤢🤢🤔" });
    }

    try {
      if (!req.file) {
        return res.status(400).send({ error: "Profile photo not found" });
      }

      const profilePhotoPath = `/Pictures/${req.file.filename}`;

      const oldPhoto = await pool.query(
        `SELECT picture FROM book WHERE id = $1`,
        [req.params.id]
      );
      
      try {
        if (oldPhoto.rows[0].picture) {
          fs.unlinkSync(path.join(`${process.cwd()}/uploads`, oldPhoto.rows[0].picture));
        }
      } catch (error) {
        console.log("Error deleting old photo:", error);
      }

      await pool.query(
        `UPDATE book SET picture = $1 WHERE id = $2`,
        [profilePhotoPath, req.params.id]
      );

      res.status(200).send({ message: "Picture updated successfully 😎😎😎" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ error: "Server error 🤢🤢🤢🤔!" });
    }
  });
});

export default router;
/**
 * @swagger
 * /api/superadmin/book/UploadPics/{id}:
 *   post:
 *     tags:
 *       - Super-admin-Book
 *     summary: Upload a picture for a book
 *     description: Allows a Super Admin to upload or update a picture (jpeg, jpg, png, webp) for a specific book using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier (UUID) of the book.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "fe397600-01a7-4021-9797-931e8052df5e"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The picture file to be uploaded (jpeg, jpg, png, webp).
 *     responses:
 *       200:
 *         description: Picture uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Picture updated successfully 😎😎😎"
 *       400:
 *         description: Bad Request - File not provided or invalid file type/size.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     file_not_found: "Profile photo not found"
 *                     file_type_error: "Only .jpg, .jpeg, .png, and .webp files are allowed"
 *                     file_size_error: "Max size 4 MB"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book mavjud emas"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error 🤢🤢🤢🤔"
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
