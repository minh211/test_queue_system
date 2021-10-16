import * as React from "react";
import axios from "axios";
import { baseUrl } from "../Config/config";
import socketIOClient from "socket.io-client";

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
    let data = (await axios.get(`${baseUrl}/doctors/getondutydoctors`)).data;
    setOnDutyDoctors(data);
  }, []);

  React.useEffect(() => {
    refresh();
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("doctorToggleDuty", () => refresh);
  }, [refresh]);

  const getTicket = React.useCallback((doctor: OnDutyDoctor) => {
    if (doctor.ticketNumber) {
      return doctor.ticketNumber.toString().padStart(4, "0");
    } else {
      return "Available";
    }
  }, []);

  const getPatient = React.useCallback((doctor: OnDutyDoctor) => {
    if (doctor.patientFirstName) {
      let patient = doctor.patientFirstName + " " + doctor.patientLastName;
      return (
        <React.Fragment>
          <strong className="text-danger">Patient: </strong> {patient}
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
      await axios.post(`${baseUrl}/doctors/nextpatient`, {
        doctorId,
      });
      refreshTickets();
      refresh();
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
        onDutyDoctors.map((onDutyDoctor) => (
          <div key={onDutyDoctor.doctorId} className="col-sm-4 card text-center">
            <div className="card-body">
              <h1>{getTicket(onDutyDoctor)}</h1>
              <div className="card-text">
                <p>
                  <strong className="text-info">Doctor:</strong>{" "}
                  {onDutyDoctor.doctorFirstName + " " + onDutyDoctor.doctorLastName}
                </p>
                <p>{getPatient(onDutyDoctor)}</p>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => nextPatient(onDutyDoctor.doctorId)}>
                Next Patient
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OnDutyDoctors;
