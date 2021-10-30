import { Doctor, Patient, Queue, Ticket, TicketModel } from "../models";
import { ServerApi } from "../api";

export namespace TicketServices {
  export async function createTicket(ticketNumber: number): Promise<TicketModel> {
    return await Ticket.create({ isActive: true, ticketNumber });
  }

  export async function progressTicket(ticketId: string, doctorId: string): Promise<boolean> {
    const doctor = await Doctor.findByPk(doctorId);
    const ticket = await Ticket.findByPk(ticketId);

    if (!doctor || !ticket) {
      return false;
    }

    await ticket.setDoctor(doctor);
    return true;
  }

  export async function closeTicket(ticket: TicketModel): Promise<boolean> {
    await ticket.update({ isActive: false });
    return true;
  }

  export async function getNewTickets(): Promise<TicketModel[]> {
    return await Ticket.findAll({
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
      order: [["createdAt", "ASC"]],
    });
  }

  export async function getTickets(): Promise<ServerApi.GetTickets.ResBody> {
    const tickets = await Ticket.findAll({
      attributes: ["id", "ticketNumber", "queueId", "isActive", "updatedAt"],
      order: [["ticketNumber", "ASC"]],
      include: [
        {
          model: Queue,
          as: "queue",
          attributes: ["id"],
          where: { isActive: true },
        },
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "gender", "birthday", "caseDescription"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["firstName", "lastName", "id"],
          required: false,
        },
      ],
    });

    return tickets.map((ticket) => ({
      updatedAt: ticket.updatedAt,
      isActive: ticket.isActive,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      patient: {
        ...ticket.patient,
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
            onDuty: ticket.doctor.onDuty,
            doctorId: ticket.doctor.id + "",
          }
        : undefined,
    }));
  }
}
