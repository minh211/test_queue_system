import * as React from "react";
import axios, { AxiosResponse } from "axios";
import socketIOClient from "socket.io-client";

import { baseUrl } from "../Config/config";
import { Ticket } from "../Queues/Queue";

interface OnDutyDoctors {
  refreshTickets(): void;
  tickets: Ticket[];
}

export interface OnDutyDoctor {
  doctorId: string;
  lastName: string;
  firstName: string;

  ticket?: {
    ticketId: string;
    ticketNumber: number;
  };

  patient?: {
    firstName: string;
    lastName: string;
  };
}

const OnDutyDoctors: React.FC<OnDutyDoctors> = ({ refreshTickets, tickets }) => {
  const [onDutyDoctors, setOnDutyDoctors] = React.useState<OnDutyDoctor[]>([]);

  const refresh = React.useCallback(async () => {
    const response: AxiosResponse<OnDutyDoctor[]> = await axios.get(`${baseUrl}/doctors?onDuty=true`);
    setOnDutyDoctors(() => response.data);
  }, []);

  React.useEffect(() => {
    refresh().then();
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("doctorToggleDuty", () => refresh);
    return () => {
      socket.close();
    };
  }, [refresh]);

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

  const closeTicket = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      if (!ticketId) {
        if (tickets.length > 0) {
          await axios.patch(`${baseUrl}/tickets/${tickets[0].ticketId}`, { doctorId });
        }
      } else {
        await axios.patch(`${baseUrl}/tickets/${ticketId}`, { isActive: false });
      }
      refreshTickets();
      refresh().then();
    },
    [refresh, refreshTickets, tickets]
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
      {onDutyDoctors.length === 0 && "No on duty doctors."}
      {onDutyDoctors.length > 0 &&
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
              <button className="btn btn-sm btn-primary" onClick={() => closeTicket(doctorId, ticket?.ticketId)}>
                Next Patient
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OnDutyDoctors;
