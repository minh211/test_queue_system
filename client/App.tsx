import * as React from "react";
import { Route } from "react-router-dom";

import { AppContainer } from "./context";
import { NavBar } from "./components";
import { Doctor, Home, Queue } from "./views";

export const App = () => {
  return (
    <AppContainer>
      <div>
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/queue" component={Queue} />
        <Route exact path="/doctors" component={Doctor} />
        {/*<Route exact path="/signin" component={} />*/}
        {/*<Route exact path="/signup" component={} />*/}
      </div>
    </AppContainer>
  );
};
