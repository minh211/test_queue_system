import * as React from "react";
import { io } from "socket.io-client";

import { AppContext } from "../AppContainer";
import { DoctorList, NewDoctorPanel } from "../components";

export const Doctor: React.FC = () => {
  const {
    eventHandlers: { getDoctors },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const socket = io("/doctors");
    socket.on("connect", () => {
      console.log("Connected /doctors namespace from DoctorPage");
    });

    socket.on("addDoctor", () => {
      console.log(`Listened /doctors addDoctor`);
      getDoctors().then();
    });

    socket.on("updateDoctor", () => {
      console.log(`Listened /doctors updateDoctor`);
      getDoctors().then();
    });

    socket.on("deleteDoctor", () => {
      console.log(`Listened /doctors deleteDoctor`);
      getDoctors().then();
    });

    return () => {
      socket.disconnect();
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
