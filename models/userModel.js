import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // avatar: {
    //   type: String,
    //   default: null,
    // },
  },

  { versionKey: false, timestamps: true }
);

userSchema.methods.toJSON = function () {
  const copiedObj = this.toObject();
  delete copiedObj.password;
  return copiedObj;
};

export default model("User", userSchema);
