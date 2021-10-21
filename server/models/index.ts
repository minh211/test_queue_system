import { Sequelize } from "sequelize";

import * as configs from "../config/config.json";

import { doctorFactory } from "./doctor";
import { patientFactory } from "./patient";
import { queueFactory } from "./queue";
import { ticketFactory } from "./ticket";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const config = configs[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const Doctor = doctorFactory(sequelize);
export const Patient = patientFactory(sequelize);
export const Queue = queueFactory(sequelize);
export const Ticket = ticketFactory(sequelize);

Doctor.hasMany(Ticket, { foreignKey: "doctorId" });
Patient.hasOne(Ticket, { foreignKey: "patientId" });
Queue.hasMany(Ticket, { foreignKey: "queueId" });

Ticket.belongsTo(Queue, { as: "queue" });
Ticket.belongsTo(Patient, { as: "patient" });
Ticket.belongsTo(Doctor, { as: "doctor" });

export * from "./doctor";
export * from "./patient";
export * from "./queue";
export * from "./ticket";
