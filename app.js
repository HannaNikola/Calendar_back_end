import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventRouter from "./routes/eventRouter.js";
import "dotenv/config";
import "./db/db.js";
// import swaggerUi from "swagger-ui-express";
// import fs from "fs";


// const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));




// var options = {
//     swaggerOptions: {
//       url: "/api-docs/swagger.json",
//     },
//   };

const app = express();

const PORT = process.env.PORT || 2000;


app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));


app.use("/api/events", eventRouter);

app.use((_, res) => {
  res.status(404).json({
    message: "Route not found",
    status: "error",
  });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port ${PORT}`);
});
