import { InProgressTicket, Ticket } from "../types";

export namespace TicketsUtils {
  export function newTickets(tickets: Ticket[]): Ticket[] {
    return tickets.filter((ticket) => !ticket.doctor);
  }

  export function inProgressTickets(tickets: Ticket[]): InProgressTicket[] {
    return tickets.filter((ticket): ticket is InProgressTicket => ticket.isActive && !!ticket.doctor);
  }
}
