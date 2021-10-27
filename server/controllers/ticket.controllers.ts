import { DoctorModel, Ticket } from "../models";
import { io } from "../io";
import { DoctorsServices, TicketServices } from "../services";
import { asyncHandler, createError } from "../utils";
import { ServerApi } from "../api";

const ticketsNsp = io.of("/tickets");

export const getTickets = asyncHandler<never, ServerApi.GetTickets.ResBody, never>(async (req, res) => {
  const tickets = await TicketServices.getTickets();

  res.status(200).send(tickets);
});

export const updateTicket = asyncHandler<{ ticketId: string }, never, ServerApi.UpdateTicket.ReqBody>(
  async (req, res, next) => {
    const { ticketId } = req.params;
    const { isActive, doctorId } = req.body;

    if (isActive === undefined && doctorId) {
      const success = await TicketServices.progressTicket(ticketId, doctorId);

      if (!success) {
        next(createError(400, `Can not assign ticket ${ticketId} for the doctor ${doctorId}`));
        return;
      }

      res.status(204).send();
      ticketsNsp.emit("updateTicket");
      return;
    }

    if (isActive === false && !doctorId) {
      const ticket = await Ticket.findByPk("" + ticketId);
      if (!ticket) {
        next(createError(400, `Can not find the ticket with id ${ticketId}`));
        return;
      }

      await TicketServices.closeTicket(ticket);

      const currentDoctor: DoctorModel | undefined = await ticket.getDoctor();
      const success = await DoctorsServices.findNextPatient(currentDoctor?.id);

      if (!success) {
        next(createError(400, `Can not find the ticket with id ${ticketId}`));
        return;
      }

      res.status(204).send();
      ticketsNsp.emit("updateTicket");

      return;
    }

    next(createError(400, "Bad patch document"));
  }
);
