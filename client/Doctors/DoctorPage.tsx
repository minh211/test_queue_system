import * as React from "react";
import { AxiosResponse } from "axios";
import { io } from "socket.io-client";

import { AppContext } from "../context";

import { NewDoctor } from "./NewDoctor";
import { DoctorList } from "./DoctorList";

export type MutationResponse = AxiosResponse<{ success: boolean }>;

export const DoctorPage: React.FC = () => {
  const {
    eventHandlers: { getDoctors },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const doctorSocket = io("/doctors");
    doctorSocket.on("connect", () => {
      console.log("/doctors onConnect from client"); // true
    });
    doctorSocket.on("addDoctor", (data) => {
      console.log(`/doctors onAddDoctor ${data}`);
      getDoctors().then();
    });

    return () => {
      doctorSocket.close();
    };
  }, [getDoctors]);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewDoctor />
          </div>
          <div className="col-8 card">
            <DoctorList />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
