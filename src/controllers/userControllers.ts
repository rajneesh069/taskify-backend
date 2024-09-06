import { Request, Response } from "express";
import { userSchema } from "../validation/userValidation";
import axios from "axios";
import { DB_URL } from "../config";
import bcrypt from "bcrypt";

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
    console.log(response);
    if (response.status === 200) {
      return res
        .json({
          message: "User signed up successfully",
          user: response.data.user,
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
    return res.json({ message: "Server Error", error: error }).status(500);
  }
};
