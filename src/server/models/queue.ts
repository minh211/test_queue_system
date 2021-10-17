import { Sequelize, BuildOptions, Model, ModelStatic, DataTypes } from "sequelize";

export interface QueueAttributes {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  id: string;
}
export interface QueueModel extends Model<QueueAttributes>, QueueAttributes {}

export class Queue extends Model<QueueModel, QueueAttributes> {}

export type QueueStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): QueueModel;
  associate(models: Record<string, ModelStatic<Model>>): void;
};

export const queueFactory = (sequelize: Sequelize): QueueStatic => {
  const Queue = <QueueStatic>sequelize.define(
    "Queue",
    {
      isActive: DataTypes.BOOLEAN,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {}
  );
  Queue.associate = function (models) {
    // associations can be defined here
    Queue.hasMany(models.Ticket, { foreignKey: "queueId" });
  };
  return Queue;
};
