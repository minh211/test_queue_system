import express from "express";

import * as doctorController from "../controllers/doctorController";

const doctorsRouter = express.Router();

doctorsRouter.get("/", doctorController.getAllDoctors);
doctorsRouter.get("/duty-doctors", doctorController.getOnDutyDoctors);
doctorsRouter.put("/next-patient/:doctorId", doctorController.nextPatient);

doctorsRouter.post("/doctor", doctorController.addDoctor);
doctorsRouter.put("/doctor/:doctorId", doctorController.updateDoctor);
doctorsRouter.delete("/doctor/:doctorId", doctorController.deleteDoctor);

export { doctorsRouter };
