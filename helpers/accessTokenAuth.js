import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();



const accessTokenAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const [, token] = authHeader.split(" ");
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default accessTokenAuth;


