import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";

import { App } from "./App";

import "bootstrap/dist/css/bootstrap.css";

ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
