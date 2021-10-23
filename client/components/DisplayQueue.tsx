import * as React from "react";

import { AppContext } from "../AppContainer";
import { TicketsUtils } from "../utils";

export const DisplayQueue: React.FC = () => {
  const { tickets } = React.useContext(AppContext);

  const latestAssignedTicket = React.useMemo(() => {
    return (
      TicketsUtils.inProgressTickets(tickets).sort((a, b) =>
        a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0
      )?.[0] ?? undefined
    );
  }, [tickets]);

  const orderedTickets = React.useMemo(
    () =>
      TicketsUtils.inProgressTickets(tickets).sort((a, b) =>
        (a.doctor?.doctorId ?? "").localeCompare(b.doctor?.doctorId ?? "")
      ),
    [tickets]
  );

  return (
    <div className="container">
      <div className="row" style={{ marginTop: "20px" }}>
        {tickets.length === 0 && "No patient is currently being attended by doctors."}
        {latestAssignedTicket && (
          <div className="col-lg-12 card text-center" style={{ height: "250px" }}>
            <div className="card-body">
              Current queue number:
              <h1 className="text-info display-4">
                <strong>{latestAssignedTicket.ticketNumber.toString().padStart(4, "0")}</strong>
              </h1>
            </div>
            <div className="card-text">
              <p>
                <strong className="text-info">Doctor: </strong>
                {latestAssignedTicket.doctor?.firstName + " " + latestAssignedTicket.doctor?.lastName}
              </p>
              <p>
                <strong className="text-info">Patient: </strong>
                {latestAssignedTicket.patient.firstName + latestAssignedTicket.patient.lastName}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="row" style={{ marginBottom: "20px" }}>
        {orderedTickets.map(({ ticketNumber, doctor, patient }) => (
          <div key={ticketNumber} className="col-sm-4 card text-center">
            <div className="card-body">
              Queue number:
              <h1 className="text-info">{ticketNumber.toString().padStart(4, "0")}</h1>
            </div>
            <div className="card-text">
              <p>
                <strong className="text-info">Doctor: </strong>
                {`${doctor?.firstName} ${doctor?.lastName}`}
              </p>
              <p>
                <strong className="text-info">Patient: </strong>
                {`${patient.firstName} ${patient.lastName}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
