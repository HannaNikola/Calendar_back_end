import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import createHttpError from "http-errors";
import { createSession } from "../helpers/createSession.js";
import { setSessionCookies } from "../helpers/setSessionCookies.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
dotenv.config();

export const authRegister = async (req, res, next) => {
  const { password, email, name } = req.body;

  const existingUser = await User.exists({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    name,
    password: passwordHash,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json({
    message: "Registration successful",
    user: newUser,
    password: passwordHash,
  });
};

export const authLogin = async (req, res, next) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(400, "Email or password is wrong");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(400, "Email or password is wrong");
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: "Login successful",

    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
};

export const authCurrent = async (req, res) => {
  const { _id, email } = req.user;

  res.status(200).json({
    user: {
      id: _id,
      email,
    },
  });
};

export const authRefresh = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    return next(createHttpError(401, "Not authenticated"));
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return next(createHttpError(401, "Session not found"));
  }

  if (session.refreshToken !== refreshToken) {
    return next(createHttpError(401, "Invalid refresh token"));
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.findByIdAndDelete(sessionId);
    return next(createHttpError(401, "Refresh token expired"));
  }

  session.accessToken = crypto.randomBytes(30).toString("base64");
  session.accessTokenValidUntil = Date.now() + FIFTEEN_MINUTES;

  session.refreshToken = crypto.randomBytes(30).toString("base64");
  session.refreshTokenValidUntil = Date.now() + ONE_DAY;

  await session.save();

  setSessionCookies(res, session);

  res.status(200).json({ message: "Session refreshed" });
};

export const authLogout = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("sessionId", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.sendStatus(204);
};

export const authLogoutAll = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Session.deleteMany({ userId });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const authDeleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }

    const deletedSessions = await Session.deleteMany({ userId });
    console.log(
      `Deleted ${deletedSessions.deletedCount} sessions for user ${userId}`
    );

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(204).json({ message: "User and sessions deleted successfully" });
  } catch (err) {
    next(err);
  }
};
