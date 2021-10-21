import Express from "express";

import { patientsRouter } from "./patients";
import { doctorsRouter } from "./doctors";
import { queuesRouter } from "./queues";
import { ticketsRouter } from "./tickets";

export const apiRouter = Express.Router();

apiRouter.use("/patients", patientsRouter);
apiRouter.use("/doctors", doctorsRouter);
apiRouter.use("/queues", queuesRouter);
apiRouter.use("/tickets", ticketsRouter);
