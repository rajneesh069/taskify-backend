import { Request, Response } from "express";
import { userSignInSchema } from "../validation/userValidation";
import bcrypt from "bcrypt";
import axios from "axios";
import { DB_URL } from "../config";
import { AuthenticatedRequest, sign } from "../middlewares/auth";

export const loginController = async (req: Request, res: Response) => {
  const signInData = req.body;
  const result = userSignInSchema.safeParse(signInData);
  if (!result.success) {
    return res.json({
      message: "Invalid signin data",
      error: result.error.errors,
    });
  }

  try {
    const { email, username } = result.data;

    const requestData: {
      email?: string | undefined | null;
      username?: string | undefined | null;
    } = {};

    if (email) {
      requestData.email = email;
    } else if (username) {
      requestData.username = username;
    }

    const response = await axios.post(DB_URL + "/users/find", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      const { id } = response.data.user;
      const isValid = await bcrypt.compare(
        result.data.password,
        response.data.user.password
      );
      if (isValid) {
        const token = sign(id); // used Id for creating todos of a particular user
        res.cookie("token", token, {
          maxAge: 60 * 60 * 24 * 10,
          httpOnly: true,
          sameSite: "none",
        });
        return res
          .json({
            message: "Signed In Successfully",
            user: response.data.user,
            token,
          })
          .status(200);
      } else {
        return res
          .json({ message: "Sign In Failed. Invalid Credentials." })
          .status(401);
      }
    } else {
      return res
        .json({ message: "No such user exists.", user: response.data.user })
        .status(404);
    }
  } catch (error) {
    console.error(error);
    return res
      .json({ message: "Internal Server Error", error, user: null })
      .status(500);
  }
};

export const logoutController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  return res
    .json({ message: "User logged out successfully.", user: null })
    .status(200);
};

export const meController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user?.id) {
    return res.json({ message: "User Invalid. Please login again." });
  }
  return res.json({
    message: "Verified successfully",
    id: req.user.id,
  });
};
