import express from "express";

import { getActiveTickets, getAllTickets } from "../controllers/ticketController";

const ticketsRouter = express.Router();

ticketsRouter.get("/", getAllTickets);
ticketsRouter.get("/active", getActiveTickets);

export { ticketsRouter };
