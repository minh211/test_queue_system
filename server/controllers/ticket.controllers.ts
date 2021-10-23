import { Op } from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";

import { Doctor, Patient, PatientAttributes, Queue, Ticket } from "../models";
import { ResponseMessage } from "../types";
import { io } from "../io";

const ticketsNsp = io.of("/tickets");

export namespace GetTicketsHandler {
  export type ReqQuery = { active?: true };
  export type AllTicketResBody = {
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
      attributes: ["id", "ticketNumber", "queueId", "isActive"],
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
          attributes: ["id", "firstName", "lastName", "gender", "birthday", "caseDescription"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["firstName", "lastName"],
          required: false,
        },
      ],
    });

    const result: GetTicketsHandler.AllTicketResBody = tickets.map((ticket) => ({
      isActive: ticket.isActive,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      patient: {
        patientId: ticket.patient.id,
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

  if (isActive === undefined && doctorId) {
    // assign ticket for doctor
    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      res.status(400).send({ message: `Can not find the doctor with id ${doctorId}` });
      return;
    }

    await ticket.setDoctor(doctor);
    res.status(204).send();
    ticketsNsp.emit("updateTicket");
    return;
  }

  if (isActive === false && !doctorId) {
    // close ticket
    await ticket.update({ isActive: false });

    // find the next waiting ticket
    const nextTickets = await Ticket.findAll({
      attributes: ["id"],
      where: {
        isActive: true,
        doctorId: null,
      },
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
          model: Doctor,
          as: "doctor",
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["ticketNumber", "ASC"]],
    });

    const currentDoctor = await ticket.getDoctor();

    if (nextTickets && nextTickets.length) {
      await nextTickets[0].setDoctor(currentDoctor);
    }

    res.status(204).send();
    ticketsNsp.emit("updateTicket");

    return;
  }

  res.status(400).send({ message: "Bad patch document" });
});
