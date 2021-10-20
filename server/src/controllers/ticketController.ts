import { RequestHandler } from "express";
import { Op } from "sequelize";
import asyncHandler from "express-async-handler";

import { Doctor, Patient, PatientAttributes, Queue, Ticket } from "../models";
import { ResponseMessage } from "../types";

export namespace GetTicketsHandler {
  export type ReqQuery = { active?: true };
  export type AllTicketResBody = {
    ticketId: string;
    ticketNumber: number;
    queueId: string;
    patient: Omit<PatientAttributes, "id">;
    doctor?: {
      firstName: string;
      lastName: string;
    };
  }[];
  export type ResBody = ActiveTicketsResBody | AllTicketResBody;
}

export const getAllTickets: RequestHandler<never, GetTicketsHandler.ResBody, never, GetTicketsHandler.ReqQuery> =
  asyncHandler(async (req, res) => {
    const { active } = req.query;

    if (active) {
      const activeTickets = await getActiveTickets();
      res.status(200).send(activeTickets);
      return;
    }

    const tickets = await Ticket.findAll({
      attributes: ["id", "ticketNumber", "queueId"],
      where: { isActive: true },
      order: [["ticketNumber", "ASC"]],
      include: [
        {
          model: Queue,
          as: "queue",
          attributes: ["id"],
          where: {
            isActive: true,
          },
        },
        {
          model: Patient,
          as: "patient",
          attributes: ["firstName", "lastName", "gender", "birthday", "caseDescription"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["firstName", "lastName"],
          required: false,
        },
      ],
    });

    const result = tickets.map((ticket) => ({
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      patient: {
        firstName: ticket.patient.firstName,
        lastName: ticket.patient.lastName,
        gender: ticket.patient.gender,
        birthday: ticket.patient.birthday,
        caseDescription: ticket.patient.caseDescription,
      },
      queueId: ticket.queue.id,
      doctor: ticket.doctor
        ? {
            firstName: ticket.doctor.firstName,
            lastName: ticket.doctor.lastName,
          }
        : undefined,
    }));
    res.status(200).send(result);
  });

export type ActiveTicketsResBody = {
  ticketId: string;
  ticketNumber: number;
  doctor: {
    firstName: string;
    lastName: string;
  };
  patient: {
    firstName: string;
    lastName: string;
  };
}[];

export const getActiveTickets = async (): Promise<ActiveTicketsResBody> => {
  const ticketsWithDoctors = await Ticket.findAll({
    where: { isActive: true, doctorId: { [Op.ne]: null } },
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: Queue,
        as: "queue",
        attributes: ["id"],
        where: {
          isActive: true,
        },
      },
      {
        model: Patient,
        as: "patient",
        attributes: ["firstName", "lastName"],
      },
      {
        model: Doctor,
        as: "doctor",
        attributes: ["firstName", "lastName"],
      },
    ],
  });

  return ticketsWithDoctors.map((ticket) => {
    return {
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      patient: {
        firstName: ticket.patient.firstName,
        lastName: ticket.patient.lastName,
      },
      doctor: {
        firstName: ticket.doctor.firstName,
        lastName: ticket.doctor.lastName,
      },
    };
  });
};

export namespace UpdateTicketHandler {
  export type ReqParams = { ticketId: string };
  export type ReqBody = { isActive?: boolean; doctorId?: string };
  export type ResBody = never | ResponseMessage;
}

export const updateTicket: RequestHandler<
  UpdateTicketHandler.ReqParams,
  UpdateTicketHandler.ResBody,
  UpdateTicketHandler.ReqBody
> = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { isActive, doctorId } = req.body;

  const ticket = await Ticket.findByPk(ticketId);

  if (!ticket) {
    res.status(400).send({ message: `Can not find the ticket with id ${ticketId}` });
    return;
  }

  if (isActive === false && !doctorId) {
    // close ticket
    await ticket.update({ isActive: false });
    res.status(204).send();
    return;
  }

  if (isActive === undefined && doctorId) {
    // assign ticket
    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      res.status(400).send({ message: `Can not find the doctor with id ${doctorId}` });
      return;
    }

    await ticket.setDoctor(doctor);
    res.status(204).send();
    return;
  }

  res.status(400).send({ message: "Bad patch document" });
});
