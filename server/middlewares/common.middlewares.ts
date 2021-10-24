import * as Path from "path";

import express = require("express");
import { json, urlencoded } from "body-parser";
import morgan = require("morgan");
import helmet = require("helmet");
import cors = require("cors");
import { RequestHandler } from "express";

export const commonMiddlewares: RequestHandler[] = [
  morgan("dev"),
  json(),
  urlencoded({ extended: false }),
  helmet({ contentSecurityPolicy: false }),
  cors(),
  express.static(Path.join(__dirname, "static")),
];
