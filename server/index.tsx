import * as http from "http";
import * as path from "path";
import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import favicon from "serve-favicon";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { json, urlencoded } from "body-parser";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Express from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import morgan from "morgan";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import helmet from "helmet";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cors from "cors";
import { Server } from "socket.io";
import { StaticRouter } from "react-router-dom";

import App from "../client/App";

import { setIo } from "./io";
import { apiRouter } from "./routes/api";

const app = Express();
const server = http.createServer(app);
setIo(new Server(server));

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/", Express.static(path.join(__dirname, "static")), favicon(path.join(__dirname, "views", "favicon.ico")));

const manifest = fs.readFileSync(path.join(__dirname, "static/manifest.json"), "utf-8");
const assets = JSON.parse(manifest);

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  const context = {};
  const component = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  res.render("client", { assets, component });
});

const PORT = process.env.PORT || 1604;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

function print(path: any, layer: any) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
  } else if (layer.method) {
    console.log("%s /%s", layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join("/"));
  }
}

function split(thing: any) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    const match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
    return match ? match[1].replace(/\\(.)/g, "$1").split("/") : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));
