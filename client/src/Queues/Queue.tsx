import * as React from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

import OnDutyDoctors from "../Doctors/OnDutyDoctors";
import { baseUrl } from "../Config/config.js";

import TicketList from "./TicketList";
import QueueControl from "./QueueControl";

export interface Ticket {
  ticketId: string;
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
    const response = (await axios.get(`${baseUrl}/tickets`)).data;
    setTickets(response);
  }, []);

  React.useEffect(() => {
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("next", refreshTickets);
    socket.on("newPatient", refreshTickets);

    return () => {
      socket.close();
    };
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
                <QueueControl refreshTickets={refreshTickets} activeTickets={getActiveTickets} />
              </div>
            </div>
          </div>
          <div className="col-8 card">
            <OnDutyDoctors refreshTickets={refreshTickets} tickets={tickets} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 card">
            <TicketList refreshTickets={refreshTickets} tickets={tickets} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Queue;
