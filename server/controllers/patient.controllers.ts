import { RequestHandler } from "express";
import { Optional } from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";

import { io } from "../io";
import { PatientAttributes } from "../models";
import { ResponseMessage } from "../types";
import { PatientServices } from "../services";
import { createError } from "../utils";

const patientsNsp = io.of("/patients");

export namespace CreatePatientHandler {
  export type ReqBody = Optional<PatientAttributes, "id">;
  export type ResBody = ReqBody | ResponseMessage;
}

export const addPatient: RequestHandler<never, CreatePatientHandler.ResBody, CreatePatientHandler.ReqBody> =
  asyncHandler(async (req, res, next) => {
    const patient = await PatientServices.addPatient(req.body);

    if (!patient) {
      next(createError(409, "Can not create a new patient"));
      return;
    }

    res.status(201).send(patient);
    patientsNsp.emit("addPatient");
  });
