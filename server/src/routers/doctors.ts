import express from "express";

import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from "../controllers/doctorController";

const doctorsRouter = express.Router();

doctorsRouter.get("/", getDoctors);
doctorsRouter.post("/", addDoctor);
doctorsRouter.patch("/:doctorId", updateDoctor);
doctorsRouter.delete("/:doctorId", deleteDoctor);

export { doctorsRouter };
