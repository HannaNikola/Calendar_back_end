import { Session } from "../models/sessionModel.js";

export const cleanExpiredSessions = async () => {
  const result = await Session.deleteMany({
    refreshTokenValidUntil: { $lt: new Date() },
  });
  console.log("Expired sessions removed:", result.deletedCount);
};
