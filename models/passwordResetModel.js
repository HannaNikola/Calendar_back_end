import { Schema, model } from "mongoose";

const passwordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export const PasswordReset = model("PasswordReset", passwordResetSchema);
