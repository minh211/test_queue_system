import * as React from "react";
import styled from "styled-components";

import { AppContext } from "../AppContainer";
import { TicketsUtils } from "../utils";

import { TicketCard } from "./TicketCard";

export const OnDutyDoctors: React.FC = () => {
  const {
    onDutyDoctors,
    tickets,
    queue,
    eventHandlers: { updateTickets },
  } = React.useContext(AppContext);

  // const getTicket = React.useCallback((ticketNumber?: number) => {
  //   if (ticketNumber) {
  //     return ticketNumber.toString().padStart(4, "0");
  //   } else {
  //     return "Available";
  //   }
  // }, []);

  // const getPatient = React.useCallback((firstName?: string, lastName?: string) => {
  //   if (firstName && lastName) {
  //     return (
  //       <React.Fragment>
  //         <strong className="text-danger">Patient: </strong> {firstName + " " + lastName}
  //       </React.Fragment>
  //     );
  //   } else {
  //     return (
  //       <React.Fragment>
  //         <strong className="text-info">Patient: </strong>No patient.
  //       </React.Fragment>
  //     );
  //   }
  // }, []);

  const onClick = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      updateTickets(doctorId, ticketId).then();
    },
    [updateTickets]
  );

  return (
    <div
      className="row"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "5px",
        marginRight: "5px",
      }}>
      {queue && onDutyDoctors.length === 0 && "No on duty doctors."}
      {queue && onDutyDoctors.length > 0 && (
        <TicketCardWrapper>
          {onDutyDoctors.map(({ ticket, doctorId, firstName, lastName, patient }) => (
            <TicketCard
              key={doctorId}
              doctor={{ firstName, lastName }}
              patient={patient}
              ticketNumber={ticket?.ticketNumber}
              disabled={!patient && TicketsUtils.newTickets(tickets).length === 0}
              onClick={() => onClick(doctorId, ticket?.ticketId)}
            />
          ))}
        </TicketCardWrapper>
      )}
    </div>
  );
};

const TicketCardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;
