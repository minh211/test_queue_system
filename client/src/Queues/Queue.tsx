import * as React from "react";

import { OnDutyDoctors } from "../Doctors/OnDutyDoctors";

import { TicketList } from "./TicketList";
import { QueueControl } from "./QueueControl";

export const Queue: React.FC = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <div className="container">
              <div className="row">
                <QueueControl />
              </div>
            </div>
          </div>
          <div className="col-8 card">
            <OnDutyDoctors />
          </div>
        </div>
        <div className="row">
          <div className="col-12 card">
            <TicketList />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
