import crypto from "crypto";

export const generateTokenVerify = () => crypto.randomBytes(32).toString("hex");

export const hashTokenVerify = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
