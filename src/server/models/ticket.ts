import { Sequelize, BuildOptions, Model, ModelStatic, DataTypes } from "sequelize";

interface TicketAttributes {
  isActive: boolean;
  ticketNumber: number;
  id: string;
  doctorId: string;
}

export interface TicketModel extends Model<TicketAttributes>, TicketAttributes {}

export class Ticket extends Model<TicketModel, TicketAttributes> {}

export type TicketStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TicketModel;
  associate(models: Record<string, ModelStatic<Model>>): void;
};

export const ticketFactory = (sequelize: Sequelize): TicketStatic => {
  const Ticket = <TicketStatic>sequelize.define(
    "Ticket",
    {
      isActive: DataTypes.BOOLEAN,
      ticketNumber: DataTypes.INTEGER,
    },
    {}
  );
  Ticket.associate = function (models) {
    // associations can be defined here
    Ticket.belongsTo(models.Queue, { as: "queue" });
    Ticket.belongsTo(models.Patient, { as: "patient" });
    Ticket.belongsTo(models.Doctor, { as: "doctor" });
  };
  return Ticket;
};
