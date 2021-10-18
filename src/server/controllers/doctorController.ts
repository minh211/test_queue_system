import { Request, RequestHandler, Response } from "express";

import { Doctor, Patient, Queue, Ticket } from "../models";
import { getIo } from "../io";
import { DoctorAttributes } from "../models";

const io = getIo();
const home = io.of("/").on("connection", () => {
  console.log("Connected from Home page.");
});
const queue = io.of("/queue").on("connection", () => {
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
  queue.emit("doctorToggleDuty");
  res.send(result);
};

export const getAllDoctors: RequestHandler = async function (_req, res) {
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

export const getOnDutyDoctors: RequestHandler = async function (_req, res) {
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

  const result = doctors.map((doctor) => ({
    doctorId: doctor.id,
    doctorFirstName: doctor.firstName,
    doctorLastName: doctor.lastName,
    ticketId: doctor.Tickets.length > 0 ? doctor.Tickets[0].id : null,
    ticketNumber: doctor.Tickets.length > 0 ? doctor.Tickets[0].ticketNumber : null,
    patientFirstName: doctor.Tickets.length > 0 ? doctor.Tickets[0].patient.firstName : null,
    patientLastName: doctor.Tickets.length > 0 ? doctor.Tickets[0].patient.lastName : null,
  }));
  res.send(result);
};

export const nextPatient: RequestHandler = async function (req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Ticket,
          attributes: ["id"],
          where: { isActive: true },
          required: false,
          include: [
            {
              model: Queue,
              as: "queue",
              attributes: ["id"],
              where: { isActive: true },
            },
          ],
        },
      ],
    });

    if (doctor && doctor.Tickets.length > 0) {
      const ticket = await Ticket.findByPk(doctor.Tickets[0].id);
      if (ticket) {
        await ticket.update({ isActive: false });
        result.message = "Successfully closed current ticket.";
      }
    }

    const nextTicket = await Ticket.findAll({
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
      ],
      order: [["ticketNumber", "ASC"]],
    });

    if (nextTicket[0]) {
      result.message = "Successfully closed current ticket and moved to the next patient.";
    }
    result.success = true;
    home.emit("next");
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result);
};

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
  queue.emit("doctorDelete");
  res.send(result);
};

export const updateDoctor: RequestHandler = async function (req, res) {
  const { doctorId } = req.params;
  const { firstName, lastName } = req.body;
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    await Doctor.update({ firstName, lastName }, { where: { id: doctorId } });

    result.success = true;
    result.message = "Successfully updated doctor information.";
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};
