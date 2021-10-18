import { PatientModel } from "./patient";
import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { QueueModel } from "./queue";
import { DoctorModel } from "./doctor";

interface TicketAttributes {
  id: string;
  isActive: boolean;
  ticketNumber: number;

  doctorId: string;
  patientId: string;
  queueId: string;
}

export interface TicketModel
  extends Model<TicketAttributes, Optional<TicketAttributes, "id" | "doctorId" | "patientId" | "queueId">>,
    TicketAttributes {
  setPatient(patient: PatientModel): Promise<void>;
  patient: PatientModel;

  setQueue(queue: QueueModel): Promise<void>;
  queue: QueueModel;

  doctor: DoctorModel;
}

export type TicketStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TicketModel;
};

export const ticketFactory = (sequelize: Sequelize): TicketStatic => {
  return <TicketStatic>sequelize.define("Ticket", {
    isActive: DataTypes.BOOLEAN,
    ticketNumber: DataTypes.INTEGER,
  });
};
