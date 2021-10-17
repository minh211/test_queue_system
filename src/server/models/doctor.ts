import { Sequelize, Model, BuildOptions, DataTypes, ModelStatic, Optional } from "sequelize";

interface DoctorAttributes {
  firstName: string;
  lastName: string;
  onDuty: boolean;
  id: string;
}
export interface DoctorModel extends Model<DoctorAttributes, Optional<DoctorAttributes, "id">>, DoctorAttributes {}

export class Doctor extends Model<DoctorModel, DoctorAttributes> {}

export type DoctorStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DoctorModel;
  associate(models: Record<string, ModelStatic<Model>>): void;
};

export const doctorFactory = (sequelize: Sequelize): DoctorStatic => {
  const DoctorModel = <DoctorStatic>sequelize.define(
    "Doctor",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      onDuty: DataTypes.BOOLEAN,
    },
    {}
  );
  DoctorModel.associate = function (models) {
    // associations can be defined here
    DoctorModel.hasMany(models.Ticket, { foreignKey: "doctorId" });
  };

  return DoctorModel;
};
