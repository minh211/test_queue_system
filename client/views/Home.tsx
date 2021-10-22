import * as React from "react";

import { DisplayQueue, NewPatientPanel } from "../components";

export const Home = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewPatientPanel />
          </div>
          <div className="col-8 card">
            <DisplayQueue />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
