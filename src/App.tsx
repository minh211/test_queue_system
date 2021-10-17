import * as React from "react";
import NavBar from "./NavBar/NavBar";
import Home from "./Home/Home";
import Doctors from "./Doctors/Doctors";
import Queue from "./Queues/Queue";
import ModalExample from "./Home/ModalExample";
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
      <Route exact path="/test" component={ModalExample} />
    </div>
  );
};

export default App;
