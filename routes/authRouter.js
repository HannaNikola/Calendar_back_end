import express from "express"
import validatetBody from "../helpers/validateBody.js";
import {registerShema, loginShema} from "../schemas/authSchema.js"
import {authRegister,authLogin, authLogout, authCurrent} from "../controllers/authControllers.js"
import accessTokenAuth from "../helpers/accessTokenAuth.js"

// const authRouter = express.Router()

// authRouter.post("/register",validatetBody(registerShema),authRegister);
// authRouter.post("/login", validatetBody(loginShema),authLogin);
// authRouter.post("/logout", tokenAuth, authLogout)
// authRouter.get("/current", tokenAuth, authCurrent)

// export default authRouter


const authRouter = express.Router()

authRouter.post("/register",validatetBody(registerShema),authRegister);
authRouter.post("/login", validatetBody(loginShema),authLogin);
authRouter.post("/logout", accessTokenAuth, authLogout)
authRouter.get("/current", accessTokenAuth, authCurrent)

authRouter.post("/refresh", async (req, res) => {
  try {
    const { accessToken } = await verifyRefreshToken(req.cookies.refreshToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

export default authRouter