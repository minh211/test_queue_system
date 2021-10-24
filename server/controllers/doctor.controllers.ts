import { RequestHandler } from "express";

import { CreationDoctorAttributes, DoctorAttributes, PatientAttributes, TicketAttributes } from "../models";
import { io } from "../io";
import { asyncHandler, createError } from "../utils";
import { DoctorsServices } from "../services";

import getOnDutyDoctors = DoctorsServices.getOnDutyDoctors;

const doctorNsp = io.of("/doctors");

export namespace AddDoctorHandler {
  export type ReqBody = CreationDoctorAttributes;
  export type ResBody = DoctorAttributes & { doctorId: string };
}

export const addDoctor: RequestHandler<never, AddDoctorHandler.ResBody, AddDoctorHandler.ReqBody> = asyncHandler(
  async (req, res) => {
    const doctor = await DoctorsServices.addDoctor(req.body);
    doctorNsp.emit("addDoctor");
    res.status(201).send({ ...doctor, doctorId: doctor.id });
  }
);

export namespace GetDoctorsHandler {
  export type ReqQuery = { onDuty?: boolean };
  export type ReqBody = any;
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

  const doctors = await DoctorsServices.getAllDoctor();
  res.status(200).send(doctors);
});

export type GetOnDutyDoctorsResponse = Pick<DoctorAttributes, "firstName" | "lastName"> & {
  doctorId: string;
  patient?: Pick<PatientAttributes, "firstName" | "lastName">;
  ticket?: Pick<TicketAttributes, "ticketNumber"> & { ticketId: string };
};

export const deleteDoctor: RequestHandler<{ doctorId: string }> = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;

  const deleteSuccess = await DoctorsServices.deleteDoctor(doctorId);

  if (!deleteSuccess) {
    return next(createError(404, `Can not delete the doctor id ${doctorId}`));
  }

  doctorNsp.emit("deleteDoctor");
  res.status(204).send();
});

export namespace UpdateDoctorHandler {
  export type ReqParams = { doctorId: string };
  export type ReqBody = Partial<CreationDoctorAttributes>;
}

export const updateDoctor: RequestHandler<UpdateDoctorHandler.ReqParams, never, UpdateDoctorHandler.ReqBody> =
  asyncHandler(async (req, res) => {
    await DoctorsServices.updateDoctor(req.params.doctorId, req.body);

    doctorNsp.emit("updateDoctor");
    res.status(204).send();
    return;
  });
