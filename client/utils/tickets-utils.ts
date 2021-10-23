import { Ticket } from "../types";

export namespace TicketsUtils {
  export function newTickets(tickets: Ticket[]): Ticket[] {
    return tickets.filter((ticket) => !ticket.doctor);
  }

  export function doneTickets(tickets: Ticket[]): Ticket[] {
    return tickets.filter((ticket) => !ticket.isActive);
  }

  export function inProgressTickets(tickets: Ticket[]): Ticket[] {
    return tickets.filter((ticket) => ticket.isActive && ticket.doctor);
  }
}
