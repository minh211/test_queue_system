import * as Path from "path";

import favicon = require("serve-favicon");
import { RequestHandler } from "express";

export const viewMiddlewares: RequestHandler[] = [favicon(Path.join(__dirname, "views", "favicon.ico"))];
