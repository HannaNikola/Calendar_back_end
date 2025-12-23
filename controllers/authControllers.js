import userSchema from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const isProduction = process.env.IS_PRODUCTION === "true";

// export const authRegister = async (req, res, next) => {
//   const { password, email, name } = req.body;
//   const normalizedEmail = email.toLowerCase();
//   const normalizeName = name.trim();
//   try {
//     const user = await userSchema.findOne({ email: normalizedEmail });
//     if (user !== null) {
//       return res.status(409).send({ message: "Email in use" });
//     }
//     const passwordHash = await bcrypt.hash(password, 10);

//     const newUser = await userSchema.create({
//       password: passwordHash,
//       email: normalizedEmail,
//       name: normalizeName,
//     });
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     await userSchema.findByIdAndUpdate(newUser._id, { token });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       message: "Registration successful",
//       user: {
//         id: newUser._id,
//         email: newUser.email,
//         name: newUser.name,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };






export const authRegister = async (req, res, next) => {
  const { password, email, name } = req.body;
  const normalizedEmail = email.toLowerCase();
  const normalizeName = name.trim();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: normalizedEmail,
      name: normalizeName,
      password: passwordHash,
    });

    
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

   
    await User.findByIdAndUpdate(newUser._id, { refreshToken });

   
    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.IS_PRODUCTION === "true",
      sameSite: process.env.IS_PRODUCTION ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registration successful",
      accessToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
};


// export const authLogin = async (req, res, next) => {
//   const { password, email } = req.body;
//   const normalizedEmail = email.toLowerCase();

//   try {
//     const user = await userSchema.findOne({ email: normalizedEmail });
//     if (user === null) {
//       return res.status(401).send({ message: "Not authorized" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch === false) {
//       return res.status(401).send({ message: "Not authorized" });
//     }
//     const token = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     await userSchema.findByIdAndUpdate(user._id, { token });
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };




export const authLogin = async (req, res, next) => {
  const { password, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await userSchema.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Not authorized" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    )

    user.refreshToken = refreshToken;
    await user.save();

    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const authCurrent = async (req, res) => {
  const { _id, email, name } = req.user;

  res.status(200).json({
    user: {
      id: _id,
      email,
      name,
    },
  });
};


// export const authLogout = async (req, res, next) => {
//   try {
//     await userSchema.findByIdAndUpdate(req.user._id, { token: null });
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//     });
//     res.status(204).end();
//   } catch (error) {
//     next(error);
//   }
// };




export const authLogout = async (req, res, next) => {
  try {
    const isProduction = process.env.IS_PRODUCTION === "true";

    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: null,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
