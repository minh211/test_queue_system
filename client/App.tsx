import * as React from "react";
import { Route, Switch } from "react-router-dom";

import { AppContainer } from "./AppContainer";
import { NavBar } from "./components";
import { DoctorPage, HomePage, QueuePage, SignInPage, NotFoundPage } from "./views";

export const App = () => {
  return (
    <AppContainer>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/queue" component={QueuePage} />
          <Route exact path="/doctors" component={DoctorPage} />
          <Route exact path="/signIn" component={SignInPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </AppContainer>
  );
};
