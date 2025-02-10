import { app } from "./app.js";
import { config } from "./config.js";
import { connectDatabase } from "./db/index.js";

const start = async () => {
  await connectDatabase();
  app.listen(config.port, () => {
    console.log(`🚀 Server http://localhost:${config.port} manzilida ishga tushdi`);
  });
};

start().catch((err) => {
  console.error("Serverni ishga tushirishda xatolik:", err);
  process.exit(1);
});
