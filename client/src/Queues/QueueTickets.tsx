import * as React from "react";

import { Ticket } from "./Queue";

interface QueueTicketsProps {
  refreshTickets(): void;
  tickets: Ticket[];
}

const QueueTickets: React.FC<QueueTicketsProps> = ({ refreshTickets, tickets }) => {
  React.useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

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
            <tr>
              <td colSpan={6}>There are no tickets at the moment.</td>
            </tr>
          )}
          {tickets.length > 0 &&
            tickets.map((ticket) => (
              <tr key={ticket.ticketNo}>
                <td style={{ width: "100px" }}>{ticket.ticketNo.toString().padStart(4, "0")}</td>
                <td style={{ width: "200px" }}>{ticket.lastName + ", " + ticket.firstName}</td>
                <td style={{ width: "75px" }}>{ticket.gender}</td>
                <td style={{ width: "75px" }}>{ticket.birthday}</td>
                <td style={{ width: "300px" }}>{ticket.caseDescription}</td>
                <td style={{ width: "100px" }}>{ticket.doctor}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default QueueTickets;
