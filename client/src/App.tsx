import * as React from "react";
import { Route } from "react-router-dom";

import NavBar from "./NavBar/NavBar";
import Home from "./Home/Home";
import Doctors from "./Doctors/Doctors";
import Queue from "./Queues/Queue";

const App = () => {
  return (
    <div style={{ backgroundColor: "red" }}>
      <NavBar />
      <Route exact path="/" component={Home} />
      <Route exact path="/queue" component={Queue} />
      <Route exact path="/doctors" component={Doctors} />
      {/*<Route exact path="/signin" component={} />*/}
      {/*<Route exact path="/signup" component={} />*/}
    </div>
  );
};

export default App;
