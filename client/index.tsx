import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";

import App from "./App";

import "bootstrap/dist/css/bootstrap.css";

ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.register();
