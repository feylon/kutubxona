import pgsession from "connect-pg-simple";
import session from "express-session";

const PgSession = pgsession(session);

dotenv.config();
app.use(
    session({
      store: new PgSession({
        pool: global.pool,
        tableName: "session",
      }),
      secret: process.env.session,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 4 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    })
  );