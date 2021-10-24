import * as path from "path";

import express = require("express");

import { commonMiddlewares, errorMiddleware } from "./middlewares";
import { apiRouter, viewRouter, authRouter } from "./routes";

export const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(commonMiddlewares);

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/", viewRouter);

app.use(errorMiddleware);
