import express from "express";

import { createPatient } from "../controllers/patientController";

const patientsRouter = express.Router();

patientsRouter.post("/patient", createPatient);

export { patientsRouter };
