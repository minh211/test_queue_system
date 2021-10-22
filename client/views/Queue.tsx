import * as React from "react";

import { OnDutyDoctors, QueuePanel, TicketList } from "../components";

export const Queue: React.FC = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <div className="container">
              <div className="row">
                <QueuePanel />
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
