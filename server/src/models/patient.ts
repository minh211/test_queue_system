import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { Identifier } from "../types";

export interface PatientAttributes extends Identifier {
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: Date;
  caseDescription?: string;
}
export interface PatientModel extends Model<PatientAttributes, Optional<PatientAttributes, "id">>, PatientAttributes {}

type PatientStatic = typeof Model & {
  new (values?: never, options?: BuildOptions): PatientModel;
};

export const patientFactory = (sequelize: Sequelize): PatientStatic => {
  return sequelize.define(
    "Patient",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      caseDescription: DataTypes.TEXT,
    },
    {}
  );
};
