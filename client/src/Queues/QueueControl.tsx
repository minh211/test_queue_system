import * as React from "react";
import axios, { AxiosResponse } from "axios";
import socketIOClient from "socket.io-client";

import { baseUrl } from "../Config/config.js";

import { Ticket } from "./Queue";

interface QueueControlProps {
  activeTickets: number;
  refreshTickets(): void;
}

interface Queue {
  id: number;
  startDate: Date;
}

const QueueControl: React.FC<QueueControlProps> = ({ refreshTickets, activeTickets }) => {
  const [totalTickets, setTotalTickets] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [hasOpenQueue, setHasOpenQueue] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const activeQueueResponse: AxiosResponse<(Queue & { Tickets: Array<Ticket> })[]> = await axios.get(
      `${baseUrl}/queues/getactivequeue`
    );

    if (activeQueueResponse.data.length) {
      const activeQueue = activeQueueResponse.data[0];
      setHasOpenQueue(true);
      setTotalTickets(activeQueue.Tickets.length);
      setStartDate(activeQueue.startDate);
    } else {
      setHasOpenQueue(false);
      setStartDate(null);
      setTotalTickets(0);
      refreshTickets();
    }
  }, [refreshTickets]);

  React.useEffect(() => {
    refresh().then();
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("newPatient", () => {
      console.log("newPatient");
      refresh().then();
    });

    return () => {
      socket.close();
    };
  }, [refresh]);

  const openNewQueue = React.useCallback(async () => {
    await axios.post(`${baseUrl}/queues/opennewqueue`);
    refresh().then();
  }, [refresh]);

  const closeActiveQueue = React.useCallback(async () => {
    await axios.post(`${baseUrl}/queues/closeactivequeue`);
    refresh().then();
  }, [refresh]);

  const Button = React.useMemo(() => {
    return (
      <button type="button" onClick={hasOpenQueue ? closeActiveQueue : openNewQueue} className="btn btn-primary">
        {hasOpenQueue ? "Close Queue" : "Open New Queue"}
      </button>
    );
  }, [closeActiveQueue, hasOpenQueue, openNewQueue]);

  return (
    <React.Fragment>
      <div className="card" style={{ marginTop: "20px", marginBottom: "20px" }}>
        {!hasOpenQueue && (
          <div className="alert alert-warning">
            No queue is currently open. Click <em>Open New Queue</em> to start.
          </div>
        )}
        <div className="card-header text-danger">Queue Control</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span className="text text-info"> Active Tickets: </span>
            <span className="text">{activeTickets}</span>
          </li>
          <li className="list-group-item">
            <span className="text text-info"> Total Tickets: </span>
            <span className="text">{totalTickets}</span>
          </li>
          <li className="list-group-item">
            <span className="text text-info"> Date/Time Started: </span>
            <span className="text">{startDate}</span>
          </li>
        </ul>
        <div className="card-body">{Button}</div>
      </div>
    </React.Fragment>
  );
};

export default QueueControl;
