import express from "express";
import {
  getAllTodo,
  getOneTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoControllers.js";
import { celebrate } from "celebrate";
import { createTodoSchema, updateTodoSchema } from "../schemas/todoSchema.js";
import tokenAuth from "../helpers/tokenAuth.js";

const todoRouter = express.Router();

todoRouter.get("/", tokenAuth, getAllTodo);
todoRouter.get("/:id", tokenAuth, getOneTodo);
todoRouter.post("/", tokenAuth, celebrate(createTodoSchema), createTodo);
todoRouter.patch(
  "/:id",
  tokenAuth,
  celebrate(updateTodoSchema),
  updateTodo
);
todoRouter.delete("/:id", tokenAuth, deleteTodo);

export default todoRouter;
