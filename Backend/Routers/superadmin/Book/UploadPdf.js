// path : http://localhost:4100/api/superadmin/book/pdfload/fe397600-01a7-4021-9797-931e8052df5e
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
    cb(null, "uploads/Books/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${md5(Date.now().toString())}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Faqat PDF bo'lsin"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

router.post("/:id", verify, async (req, res) => {
  try {
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
      if (err.message === "Faqat PDF bo'lsin") {
        return res.status(400).send({ error: err.message });
      }
      console.log(err);
      return res.status(500).send({ error: "Server error 🤢🤢🤢🤔" });
    }

    try {
      if (!req.file) {
        return res.status(400).send({ error: "Profile photo not found" });
      }

      const profilePhotoPath = `/books/${req.file.filename}`;

      const oldPhoto = await pool.query(
        `SELECT file_url FROM book WHERE id = $1`,
        [req.params.id]
      );
      
      try {
        if (oldPhoto.rows[0].file_url) {
          fs.unlinkSync(path.join(`${process.cwd()}/uploads`, oldPhoto.rows[0].file_url));
        }
      } catch (error) {
        console.log("Error deleting old photo:", error);
      }

      await pool.query(
        `UPDATE book SET file_url = $1 WHERE id = $2`,
        [profilePhotoPath, req.params.id]
      );

      res.status(200).send({ message: "PDF updated successfully 😎😎😎" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ error: "Server error 🤢🤢🤢🤔!" });
    }
  });
});

export default router;
/**
 * @swagger
 * /api/superadmin/book/pdfload/{id}:
 *   post:
 *     tags:
 *       - Super-admin-Book
 *     summary: Upload a PDF file for a book
 *     description: Allows a Super Admin to upload or update a PDF file for a specific book using its ID.
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
 *                 description: The PDF file to be uploaded.
 *     responses:
 *       200:
 *         description: PDF file uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "PDF updated successfully 😎😎😎"
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
 *                     file_type_error: "Only .jpg and .png files are allowed"
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
