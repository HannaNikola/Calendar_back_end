import express from "express";
import { getAllTodo, getOneTodo, createTodo, updateTodo, deleteTodo } from "../controllers/todoControllers.js";
import validatetBody from "../helpers/validateBody.js";
import {createTodoSchema , updateTodoSchema} from "../schemas/todoSchema.js"

const todoRouter = express.Router();

todoRouter.get("/", getAllTodo);
todoRouter.get("/:id",getOneTodo);
todoRouter.post("/",validatetBody(createTodoSchema),createTodo);
todoRouter.patch("/:id",validatetBody(updateTodoSchema),updateTodo)
todoRouter.delete("/:id", deleteTodo )



export default todoRouter;