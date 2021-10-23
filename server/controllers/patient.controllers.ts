import { RequestHandler } from "express";
import { Optional } from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";

import { io } from "../io";
import { Patient, Queue, Ticket, PatientAttributes } from "../models";
import { ResponseMessage } from "../types";

const patientsNsp = io.of("/patients");

export namespace CreatePatientHandler {
  export type ReqBody = Optional<PatientAttributes, "id">;
  export type ResBody = ReqBody | ResponseMessage;
}

export const createPatient: RequestHandler<never, CreatePatientHandler.ResBody, CreatePatientHandler.ReqBody> =
  asyncHandler(async (req, res) => {
    const { firstName, lastName, caseDescription, gender, birthday } = req.body as PatientAttributes;
    const activeQueues = await Queue.findAll({
      where: { isActive: true },
      include: [{ model: Ticket }],
    });

    if (activeQueues.length === 0) {
      res.status(200).send({ message: "Can not create the patient when there is no active queue" });
      return;
    }

    const patient = await Patient.create({ firstName, lastName, caseDescription, gender, birthday });

    const activeQueue = activeQueues[0];
    const ticketNumber = activeQueue.Tickets.length + 1;
    const ticket = await Ticket.create({ isActive: true, ticketNumber });
    await ticket.setPatient(patient);
    await ticket.setQueue(activeQueue);

    res.status(201).send(patient);
    patientsNsp.emit("addPatient");
  });
