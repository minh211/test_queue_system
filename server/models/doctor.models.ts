import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { TicketModel } from "./ticket.models";

export interface DoctorAttributes {
  id: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}

export type CreationDoctorAttributes = Optional<DoctorAttributes, "id">;

export interface DoctorModel extends Model<DoctorAttributes, CreationDoctorAttributes>, DoctorAttributes {
  Tickets: TicketModel[];
}

type DoctorStatic = typeof Model & {
  new (values?: never, options?: BuildOptions): DoctorModel;
};

export const doctorFactory = (sequelize: Sequelize): DoctorStatic => {
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
