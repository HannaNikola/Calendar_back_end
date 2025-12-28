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

// const app = express();

// const PORT = process.env.PORT || 2000;
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://calendar-rho-seven.vercel.app",
// ];

// app.use(morgan("tiny"));
// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL || "http://localhost:3000",
// //     credentials: true,
// //   })
// // );
// cors({
//     origin: function (origin, callback) {
      
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })

// app.use(cookieParser());
// app.use(express.json());

// app.use("/api/users", authRouter);
// app.use("/api/events", eventRouter);
// app.use("/api/todo/overdue", filterObjectRouter);
// app.use("/api/todo", todoRouter);

// app.use((_, res) => {
//   res.status(404).json({
//     message: "Route not found",
//     status: "error",
//   });
// });
// app.use((err, req, res, next) => {
//   console.log("error", err);
//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });

// cleanExpiredSessions().catch(console.error); 
// setInterval(
//   () => {
//     cleanExpiredSessions().catch(console.error); 
//   },
//   1000 * 60 * 60
// );

// app.listen(PORT, () => {
//   console.log(`Server is running. Use our API on port ${PORT}`);
// });







const app = express();
const PORT = process.env.PORT || 2000;


const allowedOrigins = [
  "http://localhost:3000",
  "https://calendar-rho-seven.vercel.app",
];


app.use(morgan("tiny"));


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
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
  console.error("error", err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


cleanExpiredSessions().catch(console.error);
setInterval(() => {
  cleanExpiredSessions().catch(console.error);
}, 1000 * 60 * 60); 


app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port ${PORT}`);
});