import { Router } from "express";

import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares";

export const doctorsRouter = Router();

doctorsRouter.use(authenticateMiddleware);

doctorsRouter.get("/", getDoctors);
doctorsRouter.post("/", addDoctor);
doctorsRouter.patch("/:doctorId", updateDoctor);
doctorsRouter.delete("/:doctorId", deleteDoctor);
