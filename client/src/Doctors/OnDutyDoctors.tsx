import * as React from "react";
import axios, { AxiosResponse } from "axios";
import socketIOClient from "socket.io-client";

import { baseUrl } from "../Config/config";

interface OnDutyDoctors {
  refreshTickets(): void;
}

export interface OnDutyDoctor {
  doctorId: string;
  doctorLastName: string;
  doctorFirstName: string;

  ticketNumber: number;
  patientFirstName: string;
  patientLastName: string;
}

const OnDutyDoctors: React.FC<OnDutyDoctors> = ({ refreshTickets }) => {
  const [onDutyDoctors, setOnDutyDoctors] = React.useState<OnDutyDoctor[]>([]);

  const refresh = React.useCallback(async () => {
    const response: AxiosResponse<OnDutyDoctor[]> = await axios.get(`${baseUrl}/doctors/getondutydoctors`);
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

  const getTicket = React.useCallback((ticketNumber: number) => {
    if (ticketNumber) {
      return ticketNumber.toString().padStart(4, "0");
    } else {
      return "Available";
    }
  }, []);

  const getPatient = React.useCallback((firstName: string, lastName: string) => {
    if (firstName) {
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

  const nextPatient = React.useCallback(
    async (doctorId: string) => {
      await axios.post(`${baseUrl}/doctors/nextpatient`, { doctorId });
      refreshTickets();
      refresh().then();
    },
    [refresh, refreshTickets]
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
        onDutyDoctors.map(
          ({ ticketNumber, patientFirstName, patientLastName, doctorId, doctorFirstName, doctorLastName }) => (
            <div key={doctorId} className="col-sm-4 card text-center">
              <div className="card-body">
                <h1>{getTicket(ticketNumber)}</h1>
                <div className="card-text">
                  <p>
                    <strong className="text-info">Doctor:</strong> {doctorFirstName + " " + doctorLastName}
                  </p>
                  <p>{getPatient(patientFirstName, patientLastName)}</p>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => nextPatient(doctorId)}>
                  Next Patient
                </button>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default OnDutyDoctors;
