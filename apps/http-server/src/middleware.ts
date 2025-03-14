import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const app = express();

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, process.env.JWR_SECRET!!);

  if (decoded) {
    //@ts-ignore
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};
