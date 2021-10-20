import { Router } from "express";

import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from "../controllers";

export const doctorsRouter = Router();

doctorsRouter.get("/", getDoctors);
doctorsRouter.post("/", addDoctor);
doctorsRouter.patch("/:doctorId", updateDoctor);
doctorsRouter.delete("/:doctorId", deleteDoctor);
