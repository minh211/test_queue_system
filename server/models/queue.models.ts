import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";

import { TicketModel } from "./ticket.models";

export interface QueueAttributes {
  id: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}
export interface QueueModel
  extends Model<QueueAttributes, Optional<QueueAttributes, "endDate" | "id">>,
    QueueAttributes {
  Tickets: TicketModel[];
}

export type QueueStatic = typeof Model & {
  new (values?: never, options?: BuildOptions): QueueModel;
};

export const queueFactory = (sequelize: Sequelize): QueueStatic => {
  return sequelize.define("Queue", {
    isActive: DataTypes.BOOLEAN,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  });
};
