import * as React from "react";

import { AppContext } from "../AppContainer";

export const OnDutyDoctors: React.FC = () => {
  const {
    onDutyDoctors,
    queue,
    eventHandlers: { updateTickets },
  } = React.useContext(AppContext);

  const getTicket = React.useCallback((ticketNumber?: number) => {
    if (ticketNumber) {
      return ticketNumber.toString().padStart(4, "0");
    } else {
      return "Available";
    }
  }, []);

  const getPatient = React.useCallback((firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return (
        <React.Fragment>
          <strong className="text-danger">Patient: </strong> {firstName + " " + lastName}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <strong className="text-info">Patient: </strong>No patient.
        </React.Fragment>
      );
    }
  }, []);

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
      {queue &&
        onDutyDoctors.length > 0 &&
        onDutyDoctors.map(({ ticket, patient, doctorId, firstName, lastName }) => (
          <div key={doctorId} className="col-sm-4 card text-center">
            <div className="card-body">
              <h1>{getTicket(ticket?.ticketNumber)}</h1>
              <div className="card-text">
                <p>
                  <strong className="text-info">Doctor:</strong> {firstName + " " + lastName}
                </p>
                <p>{getPatient(patient?.firstName, patient?.lastName)}</p>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => onClick(doctorId, ticket?.ticketId)}>
                Next Patient
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};
