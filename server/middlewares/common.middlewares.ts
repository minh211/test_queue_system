import * as Path from "path";

import express, { RequestHandler } from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

export const commonMiddlewares: RequestHandler[] = [
  morgan("dev"),
  json(),
  urlencoded({ extended: false }),
  helmet({ contentSecurityPolicy: false }),
  cors(),
  express.static(Path.join(__dirname, "static")),
];
