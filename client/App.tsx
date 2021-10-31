import * as React from "react";
import { Route, Switch } from "react-router-dom";

import { AppContainer } from "./AppContainer";
import { NavBar, NotificationCenter } from "./components";
import { DoctorPage, HomePage, QueuePage, SignInPage, NotFoundPage } from "./views";

export const App = () => {
  return (
    <AppContainer>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/queue" component={QueuePage} />
        <Route exact path="/doctors" component={DoctorPage} />
        <Route exact path="/signIn" component={SignInPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <NotificationCenter />
    </AppContainer>
  );
};
