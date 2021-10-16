import * as React from "react";
import QueueTickets from "./QueueTickets";
import QueueControl from "./QueueControl";
import OnDutyDoctors from "../Doctors/OnDutyDoctors";
import axios from "axios";
import { baseUrl } from "../Config/config.js";
import socketIOClient from "socket.io-client";

export interface Ticket {
  isActive: boolean;
  ticketNo: number;
  lastName: string;
  firstName: string;
  gender: string;
  caseDescription: string;
  doctor: string;
  birthday: string;
}

const Queue: React.FC = () => {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);

  const refreshTickets = React.useCallback(async () => {
    let response = (await axios.get(`${baseUrl}/queues/gettickets`)).data;
    setTickets(response);
  }, []);

  React.useEffect(() => {
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("next", refreshTickets);
    socket.on("newPatient", refreshTickets);
  }, [refreshTickets]);

  const getActiveTickets = React.useMemo(() => {
    return tickets.filter((ticket) => ticket.isActive).length;
  }, [tickets]);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <div className="container">
              <div className="row">
                <QueueControl
                  refreshTickets={refreshTickets}
                  activeTickets={getActiveTickets}
                  totalTickets={tickets.length}
                />
              </div>
            </div>
          </div>
          <div className="col-8 card">
            <OnDutyDoctors refreshTickets={refreshTickets} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 card">
            <QueueTickets refreshTickets={refreshTickets} tickets={tickets} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Queue;
