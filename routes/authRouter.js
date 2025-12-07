import express from "express"
import validatetBody from "../helpers/validateBody.js";
import {registerShema, loginShema} from "../schemas/authSchema.js"
import {authRegister,authLogin, authLogout, authCurrent} from "../controllers/authControllers.js"
import tokenAuth from "../helpers/tokenAuth.js";

const authRouter = express.Router()

authRouter.post("/register",validatetBody(registerShema),authRegister);
authRouter.post("/login", validatetBody(loginShema),authLogin);
authRouter.get("/logout", tokenAuth, authLogout)
authRouter.get("/current", tokenAuth, authCurrent)

export default authRouter