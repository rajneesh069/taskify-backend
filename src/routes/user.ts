import { Router } from "express";
import { signupController } from "../controllers/userControllers";
import { loginController, meController } from "../controllers/authControllers";

const router = Router();

router.get("/me", meController)

router.post("/login", loginController);

router.post("/signup", signupController);

// router.get("/todos", getTodosController);

// router.get("/todos/:id", getTodoController);

// router.post("/addTodo", addTodoController);

// router.put("/editTodo/:id", editTodoController);

// router.delete("/deleteTodo/:id", deleteTodoController);


export default router;
