import { Router } from "express";
import {
  addTodoController,
  deleteTodoController,
  editTodoController,
  getTodoController,
  getTodosController,
  signupController,
} from "../controllers/userControllers";
import {
  loginController,
  logoutController,
  meController,
} from "../controllers/authControllers";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/me", authorize, meController);

router.post("/login", loginController);

router.post("/signup", signupController);

router.get("/logout", logoutController);

router.get("/todos", authorize, getTodosController);

router.get("/todos/:id", authorize, getTodoController);

router.post("/addTodo", authorize, addTodoController);

router.put("/editTodo/:id", editTodoController);

router.delete("/deleteTodo/:id", deleteTodoController);

export default router;
