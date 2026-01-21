import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import createHttpError from "http-errors";
import { createSession } from "../helpers/createSession.js";
import { setSessionCookies } from "../helpers/setSessionCookies.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import {
  generateTokenVerify,
  hashTokenVerify,
} from "../helpers/generateTokenVerify.js";
import EmailVerification from "../models/emailVerifycationModel.js";
import { sendEmail } from "../helpers/sendEmail.js";


// export const authRegister = async (req, res, next) => {
//   const { password, email, name } = req.body;

//   const existingUser = await User.exists({ email });
//   if (existingUser) {
//     throw createHttpError(409, "Email in use");
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   const newUser = await User.create({
//     email,
//     name,
//     password: passwordHash,
//   });

//   const newSession = await createSession(newUser._id);
//   setSessionCookies(res, newSession);

//   res.status(201).json({
//     message: "Registration successful",
//     user: newUser,
//     password: passwordHash,
//   });
// };

export const authRegister = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.emailVerified) {
      throw createHttpError(
        409,
        "Email already registered but not verified. Check your email."
      );
    }

    throw createHttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    name,
    password: passwordHash,
    emailVerified: false,
  });

  const token = generateTokenVerify();
  const tokenHash = hashTokenVerify(token);

  await EmailVerification.create({
    userId: newUser._id,
    tokenHash,
    expiredAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  try {
    await sendEmail({
      to: newUser.email,
      subject: "Confirm your email",
      html: `
        <div style="font-family: Arial;">
          <h2>Confirm your email</h2>
          <p>Click the button below to verify your email:</p>

           <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}"
             style="padding:12px 24px;background:#0000CD;color:white;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        </div>
      `,
    });
  } catch (err) {
    await User.findByIdAndDelete(newUser._id);
    await EmailVerification.deleteOne({ userId: newUser._id });
    throw createHttpError(500, "Failed to send verification email");
  }

  res.status(201).json({
    message: "Registration successful. Check your email.",
  });
};

// export const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   if (!token) {
//     throw createHttpError(400, "Verification token is required");
//   }

//   const tokenHash = hashTokenVerify(token);

//   const record = await EmailVerification.findOne({
//     tokenHash,
//     expiredAt: { $gt: Date.now() },
//   });

//   if (!record) {
//     throw createHttpError(400, "Invalid or expired verification token");
//   }

//   const user = await User.findById(record.userId);
//   if (!user) {
//     throw createHttpError(404, "User not found");
//   }

//   user.emailVerified = true;
//   await user.save();

//   await EmailVerification.deleteOne({ _id: record._id });

//   const session = await createSession(user._id);
//   setSessionCookies(res, session);

//   res.status(200).json({
//     message: "Email verified successfully",
//     user: {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//     },
//   });
// };

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw createHttpError(400, "Verification token is required");
  }

  const tokenHash = hashTokenVerify(token);

  const record = await EmailVerification.findOne({
    tokenHash,
    expiredAt: { $gt: Date.now() },
  });

  if (!record) {
    throw createHttpError(400, "Invalid or expired verification token");
  }

  const user = await User.findById(record.userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  user.emailVerified = true;
  await user.save();

  await EmailVerification.deleteOne({ _id: record._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  return res.redirect(`${process.env.FRONTEND_URL}/calendar`);
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
  if (!user.emailVerified) {
    throw createHttpError(403, "Email not verified");
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
