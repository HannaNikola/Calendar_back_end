import User from "../models/userModel.js";
import dotenv from "dotenv";
import { Session } from "../models/sessionModel.js";
import createHttpError from "http-errors";
dotenv.config();

const tokenAuth = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken || !sessionId) {
    return next(createHttpError(401, "Not authenticated"));
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return next(createHttpError(401, "Session not found"));
  }

  if (session.accessToken !== accessToken) {
    return next(createHttpError(401, "Invalid access token"));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, "Access token expired"));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, "User not found"));
  }

  req.user = user;
  req.session = session;

  next();
};

export default tokenAuth;
