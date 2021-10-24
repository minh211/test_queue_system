import * as React from "react";
import { io } from "socket.io-client";

import { AppContext } from "../AppContainer";
import { DoctorList, NewDoctorPanel } from "../components";

export const DoctorPage: React.FC = () => {
  const {
    eventHandlers: { getDoctors },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    getDoctors().then();
  }, [getDoctors]);

  React.useEffect(() => {
    const socket = io("/doctors");
    socket.on("addDoctor", async () => await getDoctors());
    socket.on("updateDoctor", async () => await getDoctors());
    socket.on("deleteDoctor", async () => await getDoctors());

    return () => {
      socket.close();
    };
  }, [getDoctors]);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewDoctorPanel />
          </div>
          <div className="col-8 card">
            <DoctorList />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
