import express from "express"
import validatetBody from "../helpers/validateBody.js";
import {registerShema, loginShema} from "../schemas/authSchema.js"
import {authRegister,authLogin} from "../controllers/authControllers.js"

const authRouter = express.Router()

authRouter.post("/register",validatetBody(registerShema),authRegister);
authRouter.post("/login", validatetBody(loginShema),authLogin);
authRouter.get("/logout")
authRouter.get("/current")

export default authRouter