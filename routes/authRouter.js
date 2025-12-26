import express from "express";
import { registerShema, loginShema } from "../schemas/authSchema.js";
import {
  authRegister,
  authLogin,
  authLogout,
  authLogoutAll,
  authCurrent,
  authRefresh,
  authDeleteUser,
} from "../controllers/authControllers.js";
import tokenAuth from "../helpers/tokenAuth.js";
import { celebrate } from "celebrate";

const authRouter = express.Router();

authRouter.post("/register", celebrate(registerShema), authRegister);
authRouter.post("/login", celebrate(loginShema), authLogin);
authRouter.post("/refresh", authRefresh);
authRouter.post("/logout", tokenAuth, authLogout);
authRouter.post("/logout-all", tokenAuth, authLogoutAll);

authRouter.get("/current", tokenAuth, authCurrent);
authRouter.delete("/delete", tokenAuth, authDeleteUser);

export default authRouter;
