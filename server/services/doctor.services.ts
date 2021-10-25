import {
  CreationDoctorAttributes,
  Doctor,
  DoctorModel,
  Patient,
  PublicDoctorAttributes,
  Queue,
  Ticket,
} from "../models";

import { TicketServices } from "./ticket.services";

export namespace DoctorsServices {
  export async function addDoctor(params: CreationDoctorAttributes): Promise<DoctorModel> {
    return await Doctor.create(params);
  }

  export async function getAllDoctor(): Promise<PublicDoctorAttributes[]> {
    const doctors = await Doctor.findAll({
      attributes: ["id", "firstName", "lastName", "onDuty"],
      order: [
        ["lastName", "ASC"],
        ["firstName", "ASC"],
      ],
    });

    return doctors.map((doctor) => {
      return {
        doctorId: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        onDuty: doctor.onDuty,
      };
    });
  }

  export async function getOnDutyDoctors(): Promise<PublicDoctorAttributes[]> {
    const doctors = await Doctor.findAll({
      attributes: ["id", "firstName", "lastName"],
      where: { onDuty: true },
      order: [
        ["lastName", "ASC"],
        ["firstName", "ASC"],
      ],
      include: [
        {
          model: Ticket,
          where: { isActive: true },
          attributes: ["id", "ticketNumber"],
          required: false,
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
              attributes: ["firstName", "lastName"],
              required: false,
            },
          ],
        },
      ],
    });

    return doctors.map((doctor) => ({
      doctorId: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      onDuty: doctor.onDuty,
      ticket:
        doctor.Tickets.length > 0
          ? {
              ticketNumber: doctor.Tickets[0].ticketNumber,
              ticketId: doctor.Tickets[0].id,
              updatedAt: doctor.Tickets[0].updatedAt,
              isActive: doctor.Tickets[0].isActive,
            }
          : undefined,
      patient:
        doctor.Tickets.length > 0
          ? {
              firstName: doctor.Tickets[0].patient.firstName,
              lastName: doctor.Tickets[0].patient.lastName,
            }
          : undefined,
    }));
  }

  export async function deleteDoctor(doctorId: string): Promise<boolean> {
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return false;
    }

    await Doctor.destroy({ where: { id: doctorId } });
    return true;
  }

  export async function updateDoctor(doctorId: string, update: Partial<CreationDoctorAttributes>): Promise<void> {
    await Doctor.update(update, { where: { id: doctorId } });
  }

  export async function findNextPatient(doctorId?: string): Promise<boolean> {
    if (!doctorId) {
      return false;
    }
    const doctor = await Doctor.findByPk(doctorId);

    const newTickets = await TicketServices.getNewTickets();

    if (newTickets.length && doctor) {
      await newTickets[0].setDoctor(doctor);
    }
    return true;
  }
}
