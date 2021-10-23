import * as React from "react";
import { io } from "socket.io-client";

import { AppContext } from "../AppContainer";
import { DisplayQueue, NewPatientPanel } from "../components";

export const Home = () => {
  const {
    eventHandlers: { getTickets },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const socket = io("/tickets");

    socket.on("updateTicket", async () => await getTickets());

    return () => {
      socket.disconnect();
    };
  }, [getTickets]);

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
