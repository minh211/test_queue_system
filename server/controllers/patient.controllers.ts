import { io } from "../io";
import { PatientServices } from "../services";
import { asyncHandler, createError } from "../utils";
import { ServerApi } from "../api";

const patientsNsp = io.of("/patients");

export const addPatient = asyncHandler<never, ServerApi.AddPatient.ResBody, ServerApi.AddPatient.ReqBody>(
  async (req, res, next) => {
    const patient = await PatientServices.addPatient(req.body);

    if (!patient) {
      next(createError(409, "Can not create a new patient"));
      return;
    }

    res.status(201).send({ ...patient, patientId: patient.id });
    patientsNsp.emit("addPatient");
  }
);
