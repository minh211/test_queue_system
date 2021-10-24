import { Sequelize } from "sequelize";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as configs from "../config/config.json";

import { doctorFactory } from "./doctor.models";
import { patientFactory } from "./patient.models";
import { queueFactory } from "./queue.models";
import { ticketFactory } from "./ticket.models";
import { userFactory } from "./user.models";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const config = configs[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(config.database, config.username, config.password, { ...config, logging: false });

export const Doctor = doctorFactory(sequelize);
export const Patient = patientFactory(sequelize);
export const Queue = queueFactory(sequelize);
export const Ticket = ticketFactory(sequelize);
export const User = userFactory(sequelize);

Doctor.hasMany(Ticket, { foreignKey: "doctorId" });
Patient.hasOne(Ticket, { foreignKey: "patientId" });
Queue.hasMany(Ticket, { foreignKey: "queueId" });

Ticket.belongsTo(Queue, { as: "queue" });
Ticket.belongsTo(Patient, { as: "patient" });
Ticket.belongsTo(Doctor, { as: "doctor" });

export * from "./doctor.models";
export * from "./patient.models";
export * from "./queue.models";
export * from "./ticket.models";
export * from "./user.models";
