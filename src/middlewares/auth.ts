import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const sign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
};

export const authorize = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
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
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.json({
          message: "Token couldn't be properly decoded, please login again.",
        });
      }
    }
  );
};
