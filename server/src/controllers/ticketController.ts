import { RequestHandler } from "express";
import { Op } from "sequelize";

import { Doctor, Patient, Queue, Ticket } from "../models";

import { MutationResponse } from "./doctorController";

export const getAllTickets: RequestHandler = async function (req, res) {
  const { active } = req.query;

  console.log(active);
  if (active) {
    const activeTickets = await getActiveTickets();
    res.send(activeTickets);
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

export const getActiveTickets = async function () {
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
      patient: ticket.patient.firstName + " " + ticket.patient.lastName,
      doctor: ticket.doctor.firstName + " " + ticket.doctor.lastName,
    };
  });
};

export const updateTicket: RequestHandler = async function (req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const { ticketId } = req.params;

    const { isActive, doctorId } = req.body;

    const ticket = await Ticket.findByPk(ticketId);

    if (ticket) {
      if (doctorId) {
        const doctor = await Doctor.findByPk(doctorId);

        if (doctor) {
          await ticket.setDoctor(doctor);
        }
      } else if (isActive === false) {
        await ticket.update({ isActive: false });
      } else {
        result.message = "Can not update the ticket";

        res.send(result);
        return;
      }

      result.success = true;
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result);
};
