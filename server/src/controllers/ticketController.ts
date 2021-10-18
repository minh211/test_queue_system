import { RequestHandler } from "express";
import { Op } from "sequelize";

import { Doctor, Patient, Queue, Ticket } from "../models";

export const getAllTickets: RequestHandler = async function (_req, res) {
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
    ticketNo: ticket.ticketNumber,
    queueId: ticket.queue.id,
    firstName: ticket.patient.firstName,
    lastName: ticket.patient.lastName,
    gender: ticket.patient.gender,
    birthday: ticket.patient.birthday,
    caseDescription: ticket.patient.caseDescription,
    doctor: ticket.doctor
      ? "Dr. " + ticket.doctor.firstName + " " + ticket.doctor.lastName
      : "No attending physician yet.",
  }));
  res.send(result);
};

export const getActiveTickets: RequestHandler = async function (_req, res) {
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

  const result = ticketsWithDoctors.map((ticket) => {
    return {
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      patient: ticket.patient.firstName + " " + ticket.patient.lastName,
      doctor: ticket.doctor.firstName + " " + ticket.doctor.lastName,
    };
  });

  res.send(result);
};
