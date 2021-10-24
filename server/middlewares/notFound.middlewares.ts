import { ErrorRequestHandler } from "express";

import { createError } from "../utils";

export const notFoundMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  next(createError(404));
};
