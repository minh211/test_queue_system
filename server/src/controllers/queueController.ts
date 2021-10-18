import * as Sequelize from "sequelize";
import { RequestHandler } from "express";

import { Patient, Queue, Ticket, Doctor } from "../models";
import { getIo } from "../io";

import { MutationResponse } from "./doctorController";

const Op = Sequelize.Op;
const io = getIo();
const home = io.of("/").on("connection", () => {
  console.log("Connected from Home page.");
});

export const getActiveQueue: RequestHandler = async function (_req, res) {
  const queue = await Queue.findAll({
    attributes: ["id", "startDate"],
    where: { isActive: true },
    include: [{ model: Ticket }],
  });
  res.send(queue);
};

export const getTickets: RequestHandler = async function (_req, res) {
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

export const getTicketsWithDoctors: RequestHandler = async function (_req, res) {
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

export const openNewQueue: RequestHandler = async function (_req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const activeQueue = await Queue.findAll({ where: { isActive: true } });
    if (activeQueue.length !== 0) {
      result.success = false;
      result.message = "There is an active queue. Close this queue before opening a new one.";
    } else {
      await Queue.create({ isActive: true, startDate: new Date() });
      result.success = true;
      result.message = "Successfully opened a new queue.";
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};

export const closeActiveQueue: RequestHandler = async function (_req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };
  try {
    const activeQueues = await Queue.findAll({ where: { isActive: true } });
    if (activeQueues.length === 0) {
      result.success = false;
      result.message = "No active queue to close.";
    } else {
      const activeQueue = activeQueues[0];
      await activeQueue.update({ isActive: false, endDate: new Date() });
      result.success = true;
      result.message = "Active queue has been successfully closed.";
      home.emit("closeQueue");
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};
