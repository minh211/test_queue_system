import * as React from "react";
import { io } from "socket.io-client";

import { OnDutyDoctors, QueuePanel, TicketList } from "../components";
import { AppContext } from "../AppContainer";

export const QueuePage: React.FC = () => {
  const {
    eventHandlers: { getDoctors, getQueue, getOnDutyDoctors, getTickets },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const socket = io("/patients");
    socket.on("addPatient", async () => await getTickets());

    return () => {
      socket.close();
    };
  }, [getTickets]);

  React.useEffect(() => {
    const socket = io("/tickets");
    socket.on("updateTickets", async () => {
      await getDoctors();
      await getOnDutyDoctors();
      await getTickets();
    });

    return () => {
      socket.close();
    };
  }, [getDoctors, getOnDutyDoctors, getTickets]);

  React.useEffect(() => {
    const socket = io("/queues");
    socket.on("openQueue", async () => await getQueue());
    socket.on("closeQueue", async () => await getQueue());

    return () => {
      socket.close();
    };
  }, [getQueue]);

  React.useEffect(() => {
    const socket = io("/doctors");
    socket.on("addDoctor", async () => {
      await getDoctors();
      await getOnDutyDoctors();
    });
    socket.on("deleteDoctor", async () => {
      await getDoctors();
      await getOnDutyDoctors();
    });
    socket.on("updateDoctor", async () => {
      await getDoctors();
      await getOnDutyDoctors();
    });

    return () => {
      socket.close();
    };
  }, [getDoctors, getOnDutyDoctors]);

  React.useEffect(() => {
    getQueue().then();
    getTickets().then();
    getOnDutyDoctors().then();
  }, [getOnDutyDoctors, getQueue, getTickets]);

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
