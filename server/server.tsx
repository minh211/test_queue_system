import * as http from "http";
import * as path from "path";

import express = require("express");

import { io } from "./io";
import { apiRouter, viewRouter } from "./routes";
import { commonMiddlewares } from "./middlewares";

const app = express();
const server = http.createServer(app);

io.attach(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use("/", express.static(path.join(__dirname, "static")));

app.use(commonMiddlewares);
app.use("/api", apiRouter);
app.use("/", viewRouter);

const PORT = process.env.PORT || 1604;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// function print(path: any, layer: any) {
//   if (layer.route) {
//     layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
//   } else if (layer.name === "router" && layer.handle.stack) {
//     layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
//   } else if (layer.method) {
//     console.log("%s /%s", layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join("/"));
//   }
// }
//
// function split(thing: any) {
//   if (typeof thing === "string") {
//     return thing.split("/");
//   } else if (thing.fast_slash) {
//     return "";
//   } else {
//     const match = thing
//       .toString()
//       .replace("\\/?", "")
//       .replace("(?=\\/|$)", "$")
//       .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
//     return match ? match[1].replace(/\\(.)/g, "$1").split("/") : "<complex:" + thing.toString() + ">";
//   }
// }
//
// app._router.stack.forEach(print.bind(null, []));
