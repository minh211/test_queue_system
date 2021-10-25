import { io } from "../io";
import { createError, asyncHandler } from "../utils";
import { DoctorsServices } from "../services";
import { ServerApi } from "../api";

const doctorNsp = io.of("/doctors");

export const addDoctor = asyncHandler<never, ServerApi.AddDoctor.ResBody, ServerApi.AddDoctor.ReqBody>(
  async (req, res) => {
    const doctor = await DoctorsServices.addDoctor(req.body);
    doctorNsp.emit("addDoctor");
    res.status(201).send({ ...doctor, doctorId: doctor.id });
  }
);

export const getDoctors = asyncHandler<never, ServerApi.GetDoctors.ResBody, never, { onDuty?: boolean }>(
  async (req, res) => {
    const { onDuty } = req.query;

    if (onDuty) {
      const dutyDoctors = await DoctorsServices.getOnDutyDoctors();
      res.status(200).send(dutyDoctors);
      return;
    }

    const doctors = await DoctorsServices.getAllDoctor();
    res.status(200).send(doctors);
  }
);

export const deleteDoctor = asyncHandler<{ doctorId: string }>(async (req, res, next) => {
  const { doctorId } = req.params;

  const deleteSuccess = await DoctorsServices.deleteDoctor(doctorId);

  if (!deleteSuccess) {
    return next(createError(404, `Can not delete the doctor id ${doctorId}`));
  }

  doctorNsp.emit("deleteDoctor");
  res.status(204).send();
});

export const updateDoctor = asyncHandler<{ doctorId: string }, never, ServerApi.UpdateDoctor.ReqBody>(
  async (req, res) => {
    await DoctorsServices.updateDoctor(req.params.doctorId, req.body);

    doctorNsp.emit("updateDoctor");
    res.status(204).send();
    return;
  }
);
