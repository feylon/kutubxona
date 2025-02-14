import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { config } from "../config.js";
import { badRequest } from "./errors.js";

const IMAGE_TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const PDF_TYPES = { "application/pdf": ".pdf" };

const makeStorage = (folder, allowed) => {
  const dir = path.join(config.uploadsDir, folder);
  fs.mkdirSync(dir, { recursive: true });
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, dir),
      filename: (_req, file, cb) => cb(null, `${randomUUID()}${allowed[file.mimetype]}`),
    }),
    fileFilter: (_req, file, cb) => {
      if (allowed[file.mimetype]) return cb(null, true);
      cb(badRequest(`Ruxsat etilgan formatlar: ${Object.values(allowed).join(", ")}`));
    },
    limits: { fileSize: folder === "books" ? 50 * 1024 * 1024 : 5 * 1024 * 1024 },
  });
};

export const uploadCover = makeStorage("covers", IMAGE_TYPES);
export const uploadPdf = makeStorage("books", PDF_TYPES);

export const publicUrl = (folder, filename) => `/uploads/${folder}/${filename}`;

/** Eski faylni (agar u uploads ichida bo'lsa) o'chiradi */
export const removeUploaded = (url) => {
  if (!url?.startsWith("/uploads/")) return;
  const file = path.join(config.uploadsDir, url.replace("/uploads/", ""));
  fs.promises.unlink(file).catch(() => {});
};
