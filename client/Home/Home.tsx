import * as React from "react";

import { NewPatient } from "../Patient/NewPatient";
import { DisplayQueue } from "../Queues/DisplayQueue";

export const Home = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewPatient />
          </div>
          <div className="col-8 card">
            <DisplayQueue />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
