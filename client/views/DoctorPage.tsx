import * as React from "react";
import { io } from "socket.io-client";

import { AppContext } from "../AppContainer";
import { DoctorList, DoctorForm } from "../components";

export const DoctorPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    eventHandlers: { getDoctors, addDoctor },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    getDoctors().then(() => setIsLoading(false));
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
    <section role="main">
      <div className="aui-page-panel">
        <div className="aui-page-panel-inner">
          <aside className="aui-page-panel-sidebar" style={{ borderRight: "1px solid #DFE1E6" }}>
            <DoctorForm onSubmit={addDoctor} />
          </aside>
          <section className="aui-page-panel-content">
            <DoctorList isLoading={isLoading} />
          </section>
        </div>
      </div>
    </section>
  );
};
