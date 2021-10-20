import { Router } from "express";

import { createPatient } from "../controllers";

export const patientsRouter = Router();

patientsRouter.post("/", createPatient);
