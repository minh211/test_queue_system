import { Router } from "express";

import { patientsRouter } from "./patients.routes";
import { doctorsRouter } from "./doctors.routes";
import { queuesRouter } from "./queues.routes";
import { ticketsRouter } from "./tickets.routes";

export const apiRouter = Router();

apiRouter.use("/patients", patientsRouter);
apiRouter.use("/doctors", doctorsRouter);
apiRouter.use("/queues", queuesRouter);
apiRouter.use("/tickets", ticketsRouter);
