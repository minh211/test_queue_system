import * as React from "react";
import { Route } from "react-router-dom";

import { AppContainer } from "./AppContainer";
import { NavBar } from "./components";
import { DoctorPage, HomePage, QueuePage, SignInPage } from "./views";

export const App = () => {
  return (
    <AppContainer>
      <div>
        <NavBar />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/queue" component={QueuePage} />
        <Route exact path="/doctors" component={DoctorPage} />
        <Route exact path="/signIn" component={SignInPage} />
      </div>
    </AppContainer>
  );
};
