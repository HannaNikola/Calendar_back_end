import express from "express";
import { getAllTodo, getOneTodo, createTodo, updateTodo, deleteTodo } from "../controllers/todoControllers.js";
import validatetBody from "../helpers/validateBody.js";
import {createTodoSchema, updateTodoSchema } from "../schemas/todoSchema.js"
import accessTokenAuth from "../helpers/accessTokenAuth.js"


const todoRouter = express.Router();


todoRouter.get("/",accessTokenAuth, getAllTodo);
todoRouter.get("/:id", accessTokenAuth, getOneTodo);
todoRouter.post("/",accessTokenAuth, validatetBody(createTodoSchema),createTodo);
todoRouter.patch("/:id",accessTokenAuth, validatetBody(updateTodoSchema),updateTodo)
todoRouter.delete("/:id", accessTokenAuth, deleteTodo )



export default todoRouter;