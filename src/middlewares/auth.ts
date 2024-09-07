import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}

export const sign = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error("Secret not available during signing.");
  const token: string = jwt.sign({ id }, secret, {
    expiresIn: 60 * 60 * 24 * 10,
  });
  return token;
};

export const authorize = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // todo: use cookies instead of auth header
  const token = req.headers.authorization?.split(" ")[1];
  console.log("req.cookies:", req.cookies);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, please login." });
  }

  const secret = process.env.JWT_SECRET as string;

  jwt.verify(
    token,
    secret,
    (err: JsonWebTokenError | TokenExpiredError | null, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Token Expired, please login again." });
        } else if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ message: "Token Invalid, please login again." });
        } else {
          return res.status(401).json({
            message: "Token couldn't be verified, please login again.",
          });
        }
      }

      req.user = decoded;
      next();
    }
  );
};
