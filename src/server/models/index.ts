import { Sequelize, Options } from "sequelize";
import { doctorFactory } from "./doctor";
import { patientFactory } from "./patient";
import { queueFactory } from "./queue";
import { ticketFactory } from "./ticket";

// @ts-ignore
import * as configs from "../config/config.json";

const env = process.env.NODE_ENV || "development";
// @ts-ignore
const config: Required<Pick<Options, "username" | "password" | "database" | "host" | "dialect">> = configs[env];

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
