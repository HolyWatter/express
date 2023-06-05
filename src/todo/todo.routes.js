import express from "express";
import * as todoController from "./todo.controller.js";

const todoRouter = express.Router();

todoRouter
  .route("/")
  .get(todoController.getAllTodo)
  .post(todoController.createTodo);

todoRouter
  .route("/:id")
  .delete(todoController.deleteTodo)
  .patch(todoController.updateTodo);

export default todoRouter;
