import * as React from "react";
import styled from "styled-components";

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
      <div>
        {!queue
          ? "No queue is opening"
          : tickets.length === 0
          ? "No patient is currently being attended by doctors."
          : null}
        {latestAssignedTicket && (
          <div className="col-lg-12 text-center" style={{ height: "250px" }}>
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
      <TicketListWrapper>
        {orderedTickets.map((ticket) => (
          <TicketCard {...ticket} />
        ))}
      </TicketListWrapper>
    </div>
  );
};

const TicketListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1% 1%;
`;
