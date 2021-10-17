import { Doctor, Patient, Queue, Ticket } from "../models";
import { Request, Response } from "express";

import { getIo } from "../io/io";
import { DoctorModel } from "../models/doctor";
import { TicketModel } from "../models/ticket";
import { PatientModel } from "../models/patient";

const io = getIo();
const home = io.of("/").on("connection", () => {
  console.log("Connected from Home page.");
});
const queue = io.of("/queue").on("connection", () => {
  console.log("Connected from Queue page.");
});

export interface MutationResponse {
  success: boolean;
  message: string;
}

export const addDoctor = async (req: Request, res: Response) => {
  let { firstName, lastName, onDuty } = req.body;
  let result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    await Doctor.create({ firstName, lastName, onDuty });
    result.success = true;
    result.message = "Successfully added a new doctor.";
  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result);
};

export const toggleDuty = async (req: Request, res: Response) => {
  let { doctorId } = req.body;
  let result: MutationResponse = {
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
  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }
  queue.emit("doctorToggleDuty");
  res.send(result);
};

export const getAllDoctors = async function (req, res) {
  let doctors = await Doctor.findAll({
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

export const getOnDutyDoctors = async function (req, res) {
  // @ts-ignore
  const doctors: (DoctorModel & { Tickets: (TicketModel & { patient: PatientModel })[] })[] = await Doctor.findAll({
    attributes: ["id", "firstName", "lastName"],
    where: {
      onDuty: true,
    },
    order: [
      ["lastName", "ASC"],
      ["firstName", "ASC"],
    ],
    include: [
      {
        model: Ticket,
        where: {
          isActive: true,
        },
        attributes: ["id", "ticketNumber"],
        required: false,
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

exports.nextPatient = async function (req, res) {
  let result = {
    success: false,
    message: null,
  };

  try {
    let { doctorId } = req.body;
    let doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Ticket,
          attributes: ["id"],
          where: {
            isActive: true,
          },
          required: false,
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
        },
      ],
    });

    if (doctor.Tickets.length > 0) {
      let ticket = await Ticket.findByPk(doctor.Tickets[0].id);
      await ticket.update({
        isActive: false,
      });
      result.message = "Successfully closed current ticket.";
    }

    let nextTicket = await Ticket.findAll({
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
      await doctor.addTicket(nextTicket[0]);
      result.message = "Successfully closed current ticket and moved to the next patient.";
    }
    result.success = true;
    home.emit("next");
  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result);
};

exports.deleteDoctor = async function (req, res) {
  let { doctorId } = req.params;
  let result = {
    success: false,
    message: null,
  };
  try {
    let doctor = await Doctor.findByPk(doctorId);
    if (doctor) {
      await Doctor.destroy({ where: { id: doctorId } });
      result.success = true;
      result.message = "Successfully deleted doctor.";
    } else {
      result.success = false;
      result.message = "Doctor not found.";
    }
  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }
  queue.emit("doctorDelete");
  res.send(result);
};

exports.updateDoctor = async function (req, res) {
  let { doctorId } = req.params;
  let { firstName, lastName } = req.body;
  let result = {
    success: false,
    message: null,
  };

  try {
    await Doctor.update({ firstName, lastName }, { where: { id: doctorId } });

    result.success = true;
    result.message = "Successfully updated doctor information.";
  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};
