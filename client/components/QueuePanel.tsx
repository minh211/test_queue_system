import * as React from "react";

import { AppContext } from "../AppContainer";
import { TicketsUtils } from "../utils";

export const QueuePanel: React.FC = () => {
  const {
    queue,
    tickets,
    eventHandlers: { closeQueue, openQueue },
  } = React.useContext(AppContext);

  const Button = React.useMemo(() => {
    const disabled = TicketsUtils.newTickets(tickets).length + TicketsUtils.inProgressTickets(tickets).length > 0;
    return (
      <button type="button" disabled={disabled} onClick={queue ? closeQueue : openQueue} className="btn btn-primary">
        {queue ? "Close Queue" : "Open New Queue"}
      </button>
    );
  }, [tickets, queue, closeQueue, openQueue]);

  return (
    <React.Fragment>
      <div className="card" style={{ marginTop: "20px", marginBottom: "20px" }}>
        {!queue && (
          <div className="alert alert-warning">
            No queue is currently open. Click <em>Open New Queue</em> to start.
          </div>
        )}
        <div className="card-header text-danger">Queue Control</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span className="text text-info"> Active Tickets: </span>
            <span className="text">{tickets.filter(({ isActive }) => isActive).length}</span>
          </li>
          <li className="list-group-item">
            <span className="text text-info"> Total Tickets: </span>
            <span className="text">{tickets.length}</span>
          </li>
          <li className="list-group-item">
            <span className="text text-info"> Date/Time Started: </span>
            <span className="text">{queue?.startDate}</span>
          </li>
        </ul>
        <div className="card-body">{Button}</div>
      </div>
    </React.Fragment>
  );
};
