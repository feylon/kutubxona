import { AppError } from "../lib/errors.js";

export const notFound = (req, _res, next) => {
  next(new AppError(404, `${req.method} ${req.originalUrl} topilmadi`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON formati noto'g'ri" });
  }
  if (err?.name === "MulterError") {
    return res.status(400).json({ message: `Fayl yuklashda xatolik: ${err.message}` });
  }
  if (err?.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Bunday yozuv allaqachon mavjud" });
  }
  if (err?.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ message: "Bog'liq yozuv topilmadi" });
  }
  console.error(err);
  return res.status(500).json({ message: "Serverda ichki xatolik" });
};
