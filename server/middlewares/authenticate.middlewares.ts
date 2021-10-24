import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN as string, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      next();
      return;
    });
  } else {
    res.sendStatus(401);
  }
};
