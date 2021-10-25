import { CreationPatientAttributes, Patient, PatientModel } from "../models";

import { QueueServices } from "./queue.services";
import { TicketServices } from "./ticket.services";

export namespace PatientServices {
  export async function addPatient(params: CreationPatientAttributes): Promise<PatientModel | undefined> {
    const activeQueue = await QueueServices.getActiveQueue();

    if (!activeQueue) {
      return undefined;
    }

    const patient = await Patient.create(params);

    const ticket = await TicketServices.createTicket(activeQueue.Tickets.length + 1);
    await ticket.setPatient(patient);
    await ticket.setQueue(activeQueue);

    return patient;
  }
}
