import * as React from "react";
import { io } from "socket.io-client";

import { AppContext } from "../context";

export const TicketList: React.FC = () => {
  const {
    tickets,
    eventHandlers: { getTickets },
  } = React.useContext(AppContext);

  React.useEffect(() => {
    const socket = io("/queues");
    socket.on("connect", () => {
      console.log("Connected /tickets namespace from Queue");
    });

    socket.on("addPatient", () => {
      console.log(`Listened /queues addPatient`);
      getTickets().then();
    });

    return () => {
      socket.disconnect();
    };
  }, [getTickets]);

  return (
    <React.Fragment>
      <table
        className="table table-striped table-hover table-bordered"
        style={{ marginTop: "20px", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th className="text-info">Ticket #</th>
            <th className="text-info">Patient</th>
            <th className="text-info">Gender</th>
            <th className="text-info">Birthday</th>
            <th className="text-info">Case Description</th>
            <th className="text-info">Attending Physician</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 && (
            <tr key={"Empty tickets"}>
              <td colSpan={6}>There are no tickets at the moment.</td>
            </tr>
          )}
          {tickets.length > 0 &&
            tickets.map((ticket, x) => {
              console.log(ticket.ticketId);
              return (
                <tr key={ticket.ticketId}>
                  <td style={{ width: "100px" }}>{ticket.ticketNumber.toString().padStart(4, "0")}</td>
                  <td style={{ width: "200px" }}>{ticket.patient.lastName + ", " + ticket.patient.firstName}</td>
                  <td style={{ width: "75px" }}>{ticket.patient.gender}</td>
                  <td style={{ width: "75px" }}>{ticket.patient.birthday}</td>
                  <td style={{ width: "300px" }}>{ticket.patient.caseDescription}</td>
                  <td style={{ width: "100px" }}>
                    {ticket.doctor ? ticket.doctor.firstName + ticket.doctor.lastName : ""}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </React.Fragment>
  );
};