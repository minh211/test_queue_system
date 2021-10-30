import * as React from "react";
import { DynamicTableStateless } from "@atlaskit/dynamic-table";
import EmptyState from "@atlaskit/empty-state";

import { AppContext } from "../AppContainer";

export const TicketList: React.FC = () => {
  const { tickets } = React.useContext(AppContext);

  if (tickets.length === 0) {
    return <EmptyState header="There are no tickets at the moment." />;
  }
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <DynamicTableStateless
      head={{
        cells: [
          { key: "ticketNumber", content: "Ticket #" },
          { key: "patientName", content: "Patient Name" },
          { key: "gender", content: "Gender" },
          { key: "birthday", content: "Birthday" },
          { key: "caseDescription", content: "Case Description" },
          { key: "attendingPhysician", content: "Attending Physician" },
        ],
      }}
      rows={tickets.map((ticket) => ({
        key: ticket.ticketId,
        cells: [
          { key: "ticketNumber", content: ticket.ticketNumber.toString().padStart(4, "0") },
          { key: "patientName", content: ticket.patient.lastName + ", " + ticket.patient.firstName },
          { key: "gender", content: ticket.patient.gender },
          { key: "birthday", content: ticket.patient.birthday },
          { key: "caseDescription", content: ticket.patient.caseDescription },
          { key: "attendingPhysician", content: ticket.doctor ? ticket.doctor.firstName + ticket.doctor.lastName : "" },
        ],
      }))}
      rowsPerPage={10}
      loadingSpinnerSize="large"
      isLoading={false}
      isFixedSize
      sortOrder="DESC"
      onSort={() => console.log("onSort")}
      onSetPage={() => console.log("onSetPage")}
    />
  );

  // return (
  //   <React.Fragment>
  //
  //     {/*<table*/}
  //     {/*  className="table table-striped table-hover table-bordered"*/}
  //     {/*  style={{ marginTop: "20px", marginBottom: "20px" }}>*/}
  //     {/*  <thead>*/}
  //     {/*    <tr>*/}
  //     {/*      <th className="text-info">Ticket #</th>*/}
  //     {/*      <th className="text-info">Patient</th>*/}
  //     {/*      <th className="text-info">Gender</th>*/}
  //     {/*      <th className="text-info">Birthday</th>*/}
  //     {/*      <th className="text-info">Case Description</th>*/}
  //     {/*      <th className="text-info">Attending Physician</th>*/}
  //     {/*    </tr>*/}
  //     {/*  </thead>*/}
  //     {/*  <tbody>*/}
  //     {/*    {tickets.length === 0 && (*/}
  //     {/*      <tr key={"Empty tickets"}>*/}
  //     {/*        <td colSpan={6}>There are no tickets at the moment.</td>*/}
  //     {/*      </tr>*/}
  //     {/*    )}*/}
  //     {/*    {tickets.length > 0 &&*/}
  //     {/*      tickets.map((ticket) => {*/}
  //     {/*        return (*/}
  //     {/*          <tr key={ticket.ticketId}>*/}

  //     {/*            <td style={{ width: "100px" }}>*/}
  //     {/*              {ticket.doctor ? ticket.doctor.firstName + ticket.doctor.lastName : ""}*/}
  //     {/*            </td>*/}
  //     {/*          </tr>*/}
  //     {/*        );*/}
  //     {/*      })}*/}
  //     {/*  </tbody>*/}
  //     {/*</table>*/}
  //   </React.Fragment>
  // );
};
