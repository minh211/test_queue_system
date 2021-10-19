import { Request, RequestHandler, Response } from "express";

import { Doctor, DoctorAttributes, Patient, Queue, Ticket } from "../models";
import { getIo } from "../io";

const io = getIo();

const queue = io?.of("/queue").on("connection", () => {
  console.log("Connected from Queue page.");
});

export interface MutationResponse {
  success: boolean;
  message: string | null;
}

export const addDoctor: RequestHandler = async (req: Request, res: Response) => {
  const { firstName, lastName, onDuty } = req.body as DoctorAttributes;
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    await Doctor.create({ firstName, lastName, onDuty });
    result.success = true;
    result.message = "Successfully added a new doctor.";
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result);
};

export const toggleDuty: RequestHandler = async (req: Request, res: Response) => {
  const { doctorId } = req.body;
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const doctor = await Doctor.findByPk(doctorId);
    if (doctor) {
      await doctor.update({ onDuty: !doctor.onDuty });
      result.success = true;
      result.message = "Successful changed doctor on-duty status.";
    } else {
      result.success = false;
      result.message = "Doctor not found.";
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  queue?.emit("doctorToggleDuty");
  res.send(result);
};

export const getDoctors: RequestHandler = async function (req, res) {
  const { onDuty } = req.query;

  if (onDuty) {
    const dutyDoctors = await getOnDutyDoctors();
    res.send(dutyDoctors);
    return;
  }

  const doctors = await Doctor.findAll({
    attributes: ["id", "firstName", "lastName", "onDuty"],
    order: [
      ["lastName", "ASC"],
      ["firstName", "ASC"],
    ],
  });

  const result = doctors.map((doctor) => {
    return {
      doctorId: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      onDuty: doctor.onDuty,
    };
  });

  res.send(result);
};

export const getOnDutyDoctors = async function () {
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

// TODO: it should be the PATCH request of tickets that changes isActive to false.

export const deleteDoctor: RequestHandler = async function (req, res) {
  const { doctorId } = req.params;
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const doctor = await Doctor.findByPk(doctorId);
    if (doctor) {
      await Doctor.destroy({ where: { id: doctorId } });
      result.success = true;
      result.message = "Successfully deleted doctor.";
    } else {
      result.success = false;
      result.message = "Doctor not found.";
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  queue?.emit("doctorDelete");
  res.send(result);
};

export const updateDoctor: RequestHandler = async function (req, res) {
  const { doctorId } = req.params;
  const { firstName, lastName, onDuty } = req.body;
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  const updates: Partial<Omit<DoctorAttributes, "id">> = { firstName, lastName, onDuty };

  try {
    await Doctor.update(updates, { where: { id: doctorId } });

    result.success = true;
    result.message = "Successfully updated doctor information.";
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};
