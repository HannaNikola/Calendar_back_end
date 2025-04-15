import "dotenv/config";
import mongoose from "mongoose";


const DB_HOST = process.env.DB_HOST;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Data base connect success");
  })
  .catch((error) => {
    console.error("Database connection error", error)
    process.exit(2)
  });
