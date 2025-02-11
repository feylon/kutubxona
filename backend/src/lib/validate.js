import { badRequest } from "./errors.js";

/** zod sxemasi bo'yicha req[source] ni tekshiradi va tozalangan qiymatni req.valid[source] ga yozadi */
export const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return next(badRequest("Ma'lumotlar noto'g'ri", details));
  }
  req.valid ??= {};
  req.valid[source] = result.data;
  next();
};
