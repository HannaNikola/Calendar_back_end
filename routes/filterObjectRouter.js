import express from "express";
import {getOverdueTodos} from "../controllers/filterObjectControllers.js"


const filterObjectRouter = express.Router();

filterObjectRouter.get('/', getOverdueTodos)

export default filterObjectRouter