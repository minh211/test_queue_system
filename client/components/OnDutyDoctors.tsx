import * as React from "react";
import styled from "styled-components";
import EmptyState from "@atlaskit/empty-state";

import { AppContext } from "../AppContainer";
import { TicketsUtils } from "../utils";

import { TicketCard } from "./TicketCard";

export const OnDutyDoctors: React.FC = () => {
  const {
    onDutyDoctors,
    tickets,
    eventHandlers: { updateTickets },
  } = React.useContext(AppContext);

  const onClick = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      updateTickets(doctorId, ticketId).then();
    },
    [updateTickets]
  );

  if (onDutyDoctors.length === 0) {
    return <EmptyState header="No on duty doctors." />;
  }

  return (
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
  );
};

const TicketCardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;
