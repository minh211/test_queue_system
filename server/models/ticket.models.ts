import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { ModelStatic } from "../utils";

import { PatientModel, PublicPatientAttributes } from "./patient.models";
import { QueueModel } from "./queue.models";
import { DoctorModel, PublicDoctorAttributes } from "./doctor.models";

export interface TicketAttributes {
  id: string;
  isActive: boolean;
  ticketNumber: number;
  updatedAt: Date;

  doctorId: string;
  patientId: string;
  queueId: string;
}

export interface PublicTicketAttributes extends Pick<TicketAttributes, "ticketNumber" | "updatedAt" | "isActive"> {
  ticketId: string;
}

export interface PublicLinkedTicketAttributes extends PublicTicketAttributes {
  queueId: string;
  patient: PublicPatientAttributes;
  doctor?: PublicDoctorAttributes;
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

export const ticketFactory = (sequelize: Sequelize): ModelStatic<TicketModel> => {
  return sequelize.define("Ticket", {
    isActive: DataTypes.BOOLEAN,
    ticketNumber: DataTypes.INTEGER,
  });
};
