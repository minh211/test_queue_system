// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";

import { DoctorModel, PatientAttributes, Ticket } from "../models";
import { ResponseMessage } from "../types";
import { io } from "../io";
import { DoctorsServices, TicketServices } from "../services";
import { createError } from "../utils";

const ticketsNsp = io.of("/tickets");

export namespace GetTicketsHandler {
  export type ResBody = {
    updatedAt: Date;
    isActive: boolean;
    ticketId: string;
    ticketNumber: number;
    queueId: string;
    patient: Omit<PatientAttributes, "id"> & { patientId: string };
    doctor:
      | undefined
      | {
          firstName: string;
          lastName: string;
          doctorId: string;
        };
  }[];
}

export const getTickets: RequestHandler<never, GetTicketsHandler.ResBody, never> = asyncHandler(async (req, res) => {
  const tickets = await TicketServices.getTickets();

  res.status(200).send(tickets);
});

export namespace UpdateTicketHandler {
  export type ReqParams = { ticketId: string };
  export type ReqBody = { isActive?: boolean; doctorId?: string };
  export type ResBody = never | ResponseMessage;
}

export const updateTicket: RequestHandler<
  UpdateTicketHandler.ReqParams,
  UpdateTicketHandler.ResBody,
  UpdateTicketHandler.ReqBody
> = asyncHandler(async (req, res, next) => {
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
});
