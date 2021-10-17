import * as React from "react";
import NavBar from "./NavBar/NavBar";
import Home from "./Home/Home";
import Doctors from "./Doctors/Doctors";
import Queue from "./Queues/Queue";
import { Route } from "react-router-dom";

const App = () => {
  return (
    <div>
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
