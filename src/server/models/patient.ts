import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface PatientAttributes {
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: Date;
  caseDescription?: string;
}
export interface PatientModel extends Model<PatientAttributes>, PatientAttributes {}

type PatientStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PatientModel;
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
