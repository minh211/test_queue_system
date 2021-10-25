import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import { ModelStatic } from "../utils";

import { PublicTicketAttributes, TicketModel } from "./ticket.models";

export interface QueueAttributes {
  id: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | undefined;
}

export type CreationQueueAttributes = Optional<QueueAttributes, "endDate" | "id">;

export interface PublicQueueAttributes extends Omit<QueueAttributes, "id"> {
  queueId: string;
  tickets: PublicTicketAttributes[];
}

export interface QueueModel extends Model<QueueAttributes, CreationQueueAttributes>, QueueAttributes {
  Tickets: TicketModel[];
}

export const queueFactory = (sequelize: Sequelize): ModelStatic<QueueModel> => {
  return sequelize.define("Queue", {
    isActive: DataTypes.BOOLEAN,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  });
};
