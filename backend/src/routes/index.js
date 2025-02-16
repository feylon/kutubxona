import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { categoryRouter } from "./category.routes.js";
import { bookRouter } from "./book.routes.js";
import { orderRouter } from "./order.routes.js";
import { userRouter } from "./user.routes.js";
import { statsRouter } from "./stats.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/stats", statsRouter);
