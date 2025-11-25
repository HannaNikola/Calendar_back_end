
import mongoose from "mongoose";

const emailRegexp =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      

    },
    // avatar: {
    //   type: String,
    //   default: null,
    // },
    // googleId: {
    //   type: String,
    //   default: null,
    // },

    token: {
      type: String,
      
    },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);


