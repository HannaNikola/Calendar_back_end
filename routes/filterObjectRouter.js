import express from "express";
import { getOverdueTodos } from "../controllers/filterObjectControllers.js";
import tokenAuth from "../helpers/tokenAuth.js";

const filterObjectRouter = express.Router();

filterObjectRouter.get("/", tokenAuth, getOverdueTodos);

export default filterObjectRouter;
