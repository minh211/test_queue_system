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
