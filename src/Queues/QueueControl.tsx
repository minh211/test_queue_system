import * as React from "react";
import axios from "axios";
import { baseUrl } from "../Config/config.js";
import socketIOClient from "socket.io-client";

interface QueueControlProps {
  activeTickets: number;
  refreshTickets(): void;
  totalTickets: number;
}

const QueueControl: React.FC<QueueControlProps> = ({ refreshTickets, activeTickets }) => {
  const [totalTickets, setTotalTickets] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [hasOpenQueue, setHasOpenQueue] = React.useState(false);

  const refresh = React.useCallback(async () => {
    let activeQueue = (await axios.get(`${baseUrl}/queues/getactivequeue`)).data;
    if (activeQueue.length) {
      activeQueue = activeQueue[0];
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
    refresh();
    const socket = socketIOClient(`${baseUrl}/queue`, { transports: ["websocket"] });
    socket.on("newPatient", refresh);
  }, [refresh]);

  const openNewQueue = React.useCallback(async () => {
    await axios.post(`${baseUrl}/queues/opennewqueue`);
    refresh();
  }, [refresh]);

  const closeActiveQueue = React.useCallback(async () => {
    await axios.post(`${baseUrl}/queues/closeactivequeue`);
    refresh();
  }, [refresh]);

  const getButton = React.useMemo(() => {
    let button = null;
    if (hasOpenQueue) {
      button = (
        <button type="button" onClick={closeActiveQueue} className="btn btn-primary">
          Close Queue
        </button>
      );
    } else {
      button = (
        <button type="button" onClick={openNewQueue} className="btn btn-primary">
          Open New Queue
        </button>
      );
    }
    return button;
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
        <div className="card-body">{getButton}</div>
      </div>
    </React.Fragment>
  );
};

export default QueueControl;
