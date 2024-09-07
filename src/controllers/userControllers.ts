import { Request, Response } from "express";
import { todoSchema, userSchema } from "../validation/userValidation";
import axios from "axios";
import { DB_URL } from "../config";
import bcrypt from "bcrypt";
import { AuthenticatedRequest, sign } from "../middlewares/auth";

export const signupController = async (req: Request, res: Response) => {
  const signupData = req.body;

  const result = userSchema.safeParse(signupData);
  if (!result.success) {
    return res
      .json({
        message: "Invalid User Data",
        error: result.error.errors,
      })
      .status(403);
  }

  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS as string);

    if (!saltRounds) {
      throw new Error("Salt rounds unavailable.");
    }
    const hashPassword = await bcrypt.hash(result.data.password, saltRounds);
    if (!hashPassword) {
      return res.json({ message: "Couldn't hash the password." }).status(500);
    }
    const response = await axios.post(
      DB_URL + "/users/create",
      { ...result.data, password: hashPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const token = sign(response.data.user.id);
      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 10,
        httpOnly: true,
        sameSite: "none",
      });
      return res
        .json({
          message: "User signed up successfully",
          user: response.data.user,
          token,
        })
        .status(200);
    } else {
      return res
        .json({
          message: "Couldn't signup the user",
          user: response.data.user,
        })
        .status(404);
    }
  } catch (error) {
    console.error(error);
    return res
      .json({ message: "Server Error", error: error, user: null })
      .status(500);
  }
};

export const getTodosController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id: string = req.user?.id;
  try {
    const response = await axios.get(DB_URL + "/todos/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(response.data.todos);
    if (response.status === 200) {
      return res
        .json({ message: "Todos found", todos: response.data.todos })
        .status(200);
    } else {
      return res
        .json({ message: "No Todos Found", todos: response.data.todos })
        .status(404);
    }
  } catch (error) {
    console.error(error);
    return res
      .json({ message: "Cannot find todos", error, todos: null })
      .status(500);
  }
};

export const addTodoController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id = req.user?.id;
  const result = todoSchema.safeParse(req.body);
  if (!result.success) {
    return res.json({ message: "Invalid Todo Data." }).status(403);
  }
  try {
    const response = await axios.post(DB_URL + "/todos/create", result.data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.status == 200) {
      return res
        .json({ message: "Todo saved successfully.", todo: response.data.todo })
        .status(200);
    } else {
      return res.json({ message: "Error occurred", todo: null }).status(400);
    }
  } catch (error) {
    console.error(error);
    return res
      .json({ message: "Error saving the todo.", error: error, todo: null })
      .status(500);
  }
};
