import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { ModelStatic, Named } from "../utils";

import { PublicTicketAttributes, TicketModel } from "./ticket.models";
import { PublicPatientAttributes } from "./patient.models";

export interface DoctorAttributes {
  id: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}

export type CreationDoctorAttributes = Optional<DoctorAttributes, "id">;

export interface PublicDoctorAttributes extends CreationDoctorAttributes {
  doctorId: string;
  patient?: Named<PublicPatientAttributes>;
  ticket?: PublicTicketAttributes;
}

export interface DoctorModel extends Model<DoctorAttributes, CreationDoctorAttributes>, DoctorAttributes {
  Tickets: TicketModel[];
}

export const doctorFactory = (sequelize: Sequelize): ModelStatic<DoctorModel> => {
  return sequelize.define(
    "Doctor",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      onDuty: DataTypes.BOOLEAN,
    },
    {}
  );
};
