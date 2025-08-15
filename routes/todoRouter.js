import express from "express";
import { getAllTodo, getOneTodo, createTodo } from "../controllers/todoControllers.js";
import validateEventBody from "../helpers/validateEventBody.js";

const todoRouter = express.Router();

todoRouter.get("/", getAllTodo);
todoRouter.get("/:id",getOneTodo);
todoRouter.post("/",createTodo);


export default todoRouter;