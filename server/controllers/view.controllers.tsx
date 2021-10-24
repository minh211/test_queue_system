import * as fs from "fs";
import * as path from "path";

import { RequestHandler } from "express";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import * as React from "react";

import { App } from "../../client/App";

export const viewController: RequestHandler = (req, res) => {
  const manifest = fs.readFileSync(path.join(__dirname, "static", "manifest.json"), "utf-8");
  const assets = JSON.parse(manifest);
  const context = {};
  const component = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  res.render("client", { assets, component });
};
