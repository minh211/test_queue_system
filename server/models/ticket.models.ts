import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { PatientModel } from "./patient.models";
import { QueueModel } from "./queue.models";
import { DoctorModel } from "./doctor.models";

export interface TicketAttributes {
  id: string;
  isActive: boolean;
  ticketNumber: number;
  updatedAt: Date;

  doctorId: string;
  patientId: string;
  queueId: string;
}

export interface TicketModel
  extends Model<
      TicketAttributes,
      Optional<TicketAttributes, "id" | "doctorId" | "patientId" | "queueId" | "updatedAt">
    >,
    TicketAttributes {
  setPatient(patient: PatientModel): Promise<void>;
  patient: PatientModel;

  setQueue(queue: QueueModel): Promise<void>;
  queue: QueueModel;

  setDoctor(doctor: DoctorModel): Promise<void>;
  doctor: DoctorModel;
  getDoctor(): Promise<DoctorModel | undefined>;
}

export type TicketStatic = typeof Model & {
  new (values?: never, options?: BuildOptions): TicketModel;
};

export const ticketFactory = (sequelize: Sequelize): TicketStatic => {
  return <TicketStatic>sequelize.define("Ticket", {
    isActive: DataTypes.BOOLEAN,
    ticketNumber: DataTypes.INTEGER,
  });
};
