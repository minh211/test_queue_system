import { Sequelize, BuildOptions, Model, ModelStatic, DataTypes } from "sequelize";

interface PatientAttributes {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: Date;
  caseDescription: string;
}
export interface PatientModel extends Model<PatientAttributes>, PatientAttributes {}

export class Patient extends Model<PatientModel, PatientAttributes> {}

export type PatientStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PatientModel;
  associate(models: Record<string, ModelStatic<Model>>): void;
};

export const patientFactory = (sequelize: Sequelize): PatientStatic => {
  const Patient = <PatientStatic>sequelize.define(
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
  Patient.associate = function (models) {
    // associations can be defined here
    Patient.hasOne(models.Ticket, { foreignKey: "patientId" });
  };
  return Patient;
};
