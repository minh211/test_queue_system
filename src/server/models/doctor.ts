import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { TicketModel } from "./ticket";

export interface DoctorAttributes {
  id: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}
export interface DoctorModel extends Model<DoctorAttributes, Optional<DoctorAttributes, "id">>, DoctorAttributes {
  Tickets: TicketModel[];
}

type DoctorStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DoctorModel;
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
