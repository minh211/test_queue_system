import * as React from "react";
import { Route } from "react-router-dom";

import { NavBar } from "./NavBar/NavBar";
import { Home } from "./Home/Home";
import { DoctorPage } from "./Doctors/DoctorPage";
import { Queue } from "./Queues/Queue";
import { AppContainer } from "./context";

const App = () => {
  return (
    <AppContainer>
      <div>
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/queue" component={Queue} />
        <Route exact path="/doctors" component={DoctorPage} />
        {/*<Route exact path="/signin" component={} />*/}
        {/*<Route exact path="/signup" component={} />*/}
      </div>
    </AppContainer>
  );
};

export default App;
