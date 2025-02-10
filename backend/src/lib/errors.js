export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new AppError(400, message, details);
export const unauthorized = (message = "Avval tizimga kiring") => new AppError(401, message);
export const forbidden = (message = "Sizda bunga ruxsat yo'q") => new AppError(403, message);
export const notFoundError = (message = "Topilmadi") => new AppError(404, message);
export const conflict = (message) => new AppError(409, message);
