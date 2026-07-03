import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventRouter from "./routes/eventRouter.js";
import "dotenv/config";
import "./db/db.js";
import todoRouter from "./routes/todoRouter.js";
import filterObjectRouter from "./routes/filterObjectRouter.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import { cleanExpiredSessions } from "./helpers/cleanExpiredSession.js";

const app = express();
const PORT = process.env.PORT || 2000;

app.use(morgan("tiny"));

const allowedOrigins = [
  "http://localhost:3000",
  "https://app--calendar--jjd2yny5y5zz.code.run",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        /\.vercel\.app$/.test(normalizedOrigin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("Blocked CORS:", origin);
      return callback(null, false);
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/todo/overdue", filterObjectRouter);
app.use("/api/todo", todoRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found", status: "error" });
});

app.use((err, req, res, next) => {
  console.error("error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

cleanExpiredSessions().catch(console.error);
setInterval(cleanExpiredSessions, 1000 * 60 * 60);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
