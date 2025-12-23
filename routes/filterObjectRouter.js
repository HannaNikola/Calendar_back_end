import express from "express";
import {getOverdueTodos} from "../controllers/filterObjectControllers.js"
import accessTokenAuth from "../helpers/accessTokenAuth.js"

const filterObjectRouter = express.Router();


filterObjectRouter.get('/', accessTokenAuth, getOverdueTodos)

export default filterObjectRouter