import { Request, RequestHandler, Response } from "express";

import { Patient, Queue, Ticket, PatientAttributes } from "../models";
import { getIo } from "../io";

import { MutationResponse } from "./doctorController";

const io = getIo();
const queue = io?.of("/queue").on("connection", () => {
  console.log("Connected from Queue page.");
});

export const createPatient: RequestHandler = async function (req: Request, res: Response) {
  const { firstName, lastName, caseDescription, gender, birthday } = req.body as PatientAttributes;
  const activeQueues = await Queue.findAll({
    where: { isActive: true },
    include: [{ model: Ticket }],
  });

  const result: MutationResponse = {
    success: false,
    message: null,
  };

  if (activeQueues.length > 0) {
    try {
      const activeQueue = activeQueues[0];
      const tickets = activeQueue.Tickets;
      const ticketNumber = tickets.length === 0 ? 1 : tickets.length + 1;
      const patient = await Patient.create({
        firstName,
        lastName,
        caseDescription,
        gender,
        birthday,
      });
      const ticket = await Ticket.create({ isActive: true, ticketNumber });
      await ticket.setPatient(patient);
      await ticket.setQueue(activeQueue);
      result.success = true;
      result.message = "Patient successfully created.";

      queue?.emit("newPatient");
    } catch (e: any) {
      result.success = false;
      result.message = e.toString();
    }
  } else {
    result.success = false;
    result.message = "No active queue.";
  }

  res.send(result);
};
