import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";

import { App } from "./App";

import "bootstrap/dist/css/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import "@atlassian/aui/dist/aui/aui-prototyping.css";

const rootEl = document.getElementById("root");
ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
console.log(module.hot);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (module.hot) {
  // Whenever a new version of App.js is available

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  module.hot.accept("./App", function () {
    // Require the new version and render it instead
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const NextApp = require("./App");
    ReactDOM.render(<NextApp />, rootEl);
  });
}
