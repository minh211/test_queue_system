import { RequestHandler } from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";

import {
  CreationDoctorAttributes,
  Doctor,
  DoctorAttributes,
  Patient,
  PatientAttributes,
  Queue,
  Ticket,
  TicketAttributes,
} from "../models";
import { io } from "../io";

const doctorNsp = io.of("/doctors");

export namespace AddDoctorHandler {
  export type ReqBody = CreationDoctorAttributes;
  export type ResBody = DoctorAttributes & { doctorId: string };
}

export const addDoctor: RequestHandler<never, AddDoctorHandler.ResBody, AddDoctorHandler.ReqBody> = asyncHandler(
  async (req, res) => {
    const { firstName, lastName, onDuty } = req.body;
    const doctor = await Doctor.create({ firstName, lastName, onDuty });
    doctorNsp.emit("addDoctor");
    res.status(201).send({ ...doctor, doctorId: doctor.id });
  }
);

export namespace GetDoctorsHandler {
  export type ReqQuery = { onDuty?: boolean };
  export type ReqBody = never;
  export type AllDoctorsResBody = (Omit<DoctorAttributes, "id"> & { doctorId: string })[];
  export type OnDutyDoctorsResBody = GetOnDutyDoctorsResponse[];
  export type ResBody = AllDoctorsResBody | OnDutyDoctorsResBody;
}

export const getDoctors: RequestHandler<
  never,
  GetDoctorsHandler.ResBody,
  GetDoctorsHandler.ReqBody,
  GetDoctorsHandler.ReqQuery
> = asyncHandler(async (req, res) => {
  const { onDuty } = req.query;

  if (onDuty) {
    const dutyDoctors = await getOnDutyDoctors();
    res.status(200).send(dutyDoctors);
    return;
  }

  const doctors = await Doctor.findAll({
    attributes: ["id", "firstName", "lastName", "onDuty"],
    order: [
      ["lastName", "ASC"],
      ["firstName", "ASC"],
    ],
  });

  const result: GetDoctorsHandler.AllDoctorsResBody = doctors.map((doctor) => {
    return {
      doctorId: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      onDuty: doctor.onDuty,
    };
  });

  res.status(200).send(result);
});

export type GetOnDutyDoctorsResponse = Pick<DoctorAttributes, "firstName" | "lastName"> & {
  doctorId: string;
  patient?: Pick<PatientAttributes, "firstName" | "lastName">;
  ticket?: Pick<TicketAttributes, "ticketNumber"> & { ticketId: string };
};

export const getOnDutyDoctors = async function (): Promise<GetOnDutyDoctorsResponse[]> {
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
    ticket:
      doctor.Tickets.length > 0
        ? { ticketNumber: doctor.Tickets[0].ticketNumber, ticketId: doctor.Tickets[0].id }
        : undefined,
    patient:
      doctor.Tickets.length > 0
        ? {
            firstName: doctor.Tickets[0].patient.firstName,
            lastName: doctor.Tickets[0].patient.lastName,
          }
        : undefined,
  }));
};

export const deleteDoctor: RequestHandler<{ doctorId: string }> = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    res.status(404).send();
    return;
  }

  await Doctor.destroy({ where: { id: doctorId } });
  doctorNsp.emit("deleteDoctor");
  res.status(204).send();
});

export namespace UpdateDoctorHandler {
  export type ReqParams = { doctorId: string };
  export type ReqBody = Partial<CreationDoctorAttributes>;
}

export const updateDoctor: RequestHandler<UpdateDoctorHandler.ReqParams, never, UpdateDoctorHandler.ReqBody> =
  asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    await Doctor.update(req.body, { where: { id: doctorId } });

    doctorNsp.emit("updateDoctor");
    res.status(204).send();
    return;
  });
