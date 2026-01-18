import { Schema, model } from "mongoose";

const emailVerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model("EmailVerification", emailVerificationSchema)