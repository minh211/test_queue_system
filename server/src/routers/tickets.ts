import express from "express";

import { updateTicket, getAllTickets } from "../controllers/ticketController";

const ticketsRouter = express.Router();

ticketsRouter.get("/", getAllTickets);
ticketsRouter.patch("/:ticketId", updateTicket);

export { ticketsRouter };
