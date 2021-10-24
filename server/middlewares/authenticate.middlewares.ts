import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

const accessTokenSecret = "youraccesstokensecret";

export const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (["/", "signIn"].includes(req.path)) {
    next();
    return;
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      next();
      return;
    });
  } else {
    res.sendStatus(401);
  }
  return;
};
