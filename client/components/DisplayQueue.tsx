import * as React from "react";
import axios from "axios";

import { apiUrl } from "../utils";

interface TicketWithDoctor {
  ticketNumber: number;
  doctor: string;
  patient: string;
}

export const DisplayQueue: React.FC = () => {
  const [ticketsWithDoctors, setTicketsWithDoctors] = React.useState<TicketWithDoctor[]>([]);

  const refreshQueue = React.useCallback(async () => {
    const response = (await axios.get(`${apiUrl}/tickets?active=true`)).data;
    setTicketsWithDoctors(response);
  }, []);

  React.useEffect(() => {
    refreshQueue().then();
  }, [refreshQueue]);

  const getLatestTicketWithDoctor = React.useMemo(() => {
    return ticketsWithDoctors[0] ?? null;
  }, [ticketsWithDoctors]);

  return (
    <div className="container">
      <div className="row" style={{ marginTop: "20px" }}>
        {ticketsWithDoctors.length === 0 && "No patient is currently being attended by doctors."}
        {getLatestTicketWithDoctor && (
          <div className="col-lg-12 card text-center" style={{ height: "250px" }}>
            <div className="card-body">
              Current queue number:
              <h1 className="text-info display-4">
                <strong>{getLatestTicketWithDoctor.ticketNumber.toString().padStart(4, "0")}</strong>
              </h1>
            </div>
            <div className="card-text">
              <p>
                <strong className="text-info">Doctor: </strong>
                {getLatestTicketWithDoctor.doctor}
              </p>
              <p>
                <strong className="text-info">Patient: </strong>
                {getLatestTicketWithDoctor.patient}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="row" style={{ marginBottom: "20px" }}>
        {getLatestTicketWithDoctor &&
          ticketsWithDoctors.map(({ ticketNumber, doctor, patient }) => (
            <div key={ticketNumber} className="col-sm-4 card text-center">
              <div className="card-body">
                Queue number:
                <h1 className="text-info">{ticketNumber.toString().padStart(4, "0")}</h1>
              </div>
              <div className="card-text">
                <p>
                  <strong className="text-info">Doctor: </strong>
                  {doctor}
                </p>
                <p>
                  <strong className="text-info">Patient: </strong>
                  {patient}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
