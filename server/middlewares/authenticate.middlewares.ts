import { RequestHandler } from "express";

import { verifyToken } from "../services";

export const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1];
    if (!verifyToken(token)) {
      return res.sendStatus(403);
    }

    next();
    return;
  } else {
    res.sendStatus(401);
  }

  return;
};
