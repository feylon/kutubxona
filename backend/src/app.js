import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin.split(",") }));
app.use(express.json({ limit: "1mb" }));
if (!config.isTest) app.use(morgan("dev"));

app.use("/uploads", express.static(config.uploadsDir, { maxAge: "1d" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);
