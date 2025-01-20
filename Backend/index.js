import express from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import pool from "./functions/database.js";
import schedule from "node-schedule";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

configDotenv();
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT 1 AS result");
    console.log("DB ishga tushdi:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("DB da muommo bor:", err);
    process.exit(1);
  }
};
schedule.scheduleJob("0 * * * *", async () => {
  try {
    await pool.query("DELETE FROM jwt_tokens WHERE expires_at < NOW()");
    console.log("Tokenlar o'chirildi");
  } catch (err) {
    console.error("Schulede xatolik :", err);
  }
});
const app = express();
app.use(cors());
app.use(express.static("./static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "JSON XATO 😢😢😢",
    });
  }
  next();
});

// Routers
// Super_Admin
import superadmin from "./Routers/superadmin/index.js";
superadmin.forEach((i) => {
  app.use(`/api/superadmin${i.path}`, i.component);
});

// Admin
import admin from "./Routers/admin/index.js";
admin.forEach((i) => {
  app.use(`/api/admin${i.path}`, i.component);
});
// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    servers: [
      {
        url: "http://localhost:4100/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Routers/**/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const server = http.createServer(app);
const startServer = async () => {
  await checkDatabaseConnection();
  server.listen(4100, () => {
    console.log("Server ", server.address().port, "da ishga tushdi");
  });
};
startServer();
