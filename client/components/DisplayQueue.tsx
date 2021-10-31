import * as React from "react";
import styled from "styled-components";
import EmptyState from "@atlaskit/empty-state";

import { AppContext } from "../AppContainer";
import { TicketsUtils } from "../utils";

import { TicketCard } from "./TicketCard";

export const DisplayQueue: React.FC = () => {
  const { tickets, queue } = React.useContext(AppContext);

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
    <div>
      <LatestTicketCardWrapper>
        {!queue ? (
          <EmptyState header="No queue is opening" />
        ) : tickets.length === 0 ? (
          <EmptyState header="No patient is currently being attended by doctors." />
        ) : null}
        {latestAssignedTicket && <TicketCard {...latestAssignedTicket} />}
      </LatestTicketCardWrapper>
      <TicketListWrapper>
        {orderedTickets.map((ticket) => (
          <TicketCard {...ticket} />
        ))}
      </TicketListWrapper>
    </div>
  );
};

const LatestTicketCardWrapper = styled.div`
  margin: 32px 34%;
`;

const TicketListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;
