import "dotenv/config";
import mongoose from "mongoose";

// const DB_HOST = process.env.DB_HOST;

// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     console.log("Data base connect success");
//   })
//   .catch((error) => {
//     console.error("Database connection error", error);
//     process.exit(2);
//   });



const env = process.env.NODE_ENV || 'development';
const DB_HOST = env === 'test' ? process.env.DB_TEST : process.env.DB_HOST;

if(!DB_HOST){
  console.error("MongoDB URI is not defined in environment variables")
  process.exit(1);
}
mongoose
  .connect(DB_HOST)
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(2);
  });