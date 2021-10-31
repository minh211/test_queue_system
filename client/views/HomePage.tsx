import * as React from "react";
import { io } from "socket.io-client";

import { DisplayQueue, PatientForm } from "../components";
import { AppContext } from "../AppContainer";

export const HomePage = () => {
  const {
    eventHandlers: { getTickets, getQueue },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const socket = io("/tickets");
    socket.on("updateTicket", async () => await getTickets());

    return () => {
      socket.close();
    };
  }, [getTickets]);

  React.useEffect(() => {
    const socket = io("/doctors");
    socket.on("updateDoctor", async () => await getTickets());

    return () => {
      socket.close();
    };
  });

  React.useEffect(() => {
    getTickets().then();
    getQueue().then();
  }, [getQueue, getTickets]);

  return (
    <section role="main">
      <div className="aui-page-panel">
        <div className="aui-page-panel-inner">
          <aside className="aui-page-panel-sidebar" style={{ borderRight: "1px solid #DFE1E6" }}>
            <PatientForm />
          </aside>
          <section className="aui-page-panel-content">
            <DisplayQueue />
          </section>
        </div>
      </div>
    </section>
  );
};
