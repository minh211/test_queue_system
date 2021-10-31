import * as React from "react";
import DynamicTable from "@atlaskit/dynamic-table";
import EmptyState from "@atlaskit/empty-state";
import Lozenge from "@atlaskit/lozenge";

import { AppContext } from "../AppContainer";
import { Ticket } from "../types";

export const TicketList: React.FC = () => {
  const { tickets } = React.useContext(AppContext);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [highlightRowIndex, setHighlightRowIndex] = React.useState<number | undefined>();

  const status = React.useCallback((ticket: Ticket) => {
    if (ticket.doctor === undefined) {
      return "new";
    }

    if (ticket.isActive) {
      return "inProgress";
    }

    return "done";
  }, []);

  if (tickets.length === 0) {
    return <EmptyState header="There are no tickets at the moment." />;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <DynamicTable
      head={{
        cells: [
          { key: "ticketNumber", content: "Ticket #", width: 10 },
          { key: "patientName", content: "Patient Name", width: 20 },
          { key: "gender", content: "Gender", width: 10 },
          { key: "birthday", content: "Birthday", width: 10 },
          { key: "caseDescription", content: "Case Description" },
          { key: "attendingPhysician", content: "Attending Physician", width: 20 },
          { key: "status", content: "Status", width: 10 },
        ],
      }}
      rows={tickets.map((ticket, index) => ({
        onClick: () => setHighlightRowIndex(index),
        key: ticket.ticketId,
        cells: [
          { key: "ticketNumber", content: ticket.ticketNumber.toString().padStart(4, "0") },
          { key: "patientName", content: ticket.patient.lastName + ", " + ticket.patient.firstName },
          { key: "gender", content: ticket.patient.gender },
          { key: "birthday", content: ticket.patient.birthday },
          { key: "caseDescription", content: ticket.patient.caseDescription },
          { key: "attendingPhysician", content: ticket.doctor ? ticket.doctor.firstName + ticket.doctor.lastName : "" },
          {
            key: "status",
            content:
              status(ticket) === "new" ? (
                <Lozenge appearance="new">New</Lozenge>
              ) : status(ticket) === "inProgress" ? (
                <Lozenge appearance="inprogress">In progress</Lozenge>
              ) : (
                <Lozenge appearance="success">Done</Lozenge>
              ),
          },
        ],
      }))}
      page={currentPage}
      rowsPerPage={10}
      loadingSpinnerSize="large"
      isLoading={false}
      isFixedSize
      sortOrder="DESC"
      onSetPage={setCurrentPage}
      highlightedRowIndex={highlightRowIndex}
    />
  );
};
