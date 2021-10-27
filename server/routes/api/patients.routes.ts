import { Router } from "express";

import { addPatient } from "../../controllers";

export const patientsRouter = Router();

patientsRouter.post("/", addPatient);
