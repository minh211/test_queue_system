import { Router } from "express";

import { updateTicket, getTickets } from "../../controllers";

export const ticketsRouter = Router();

ticketsRouter.get("/", getTickets);
ticketsRouter.patch("/:ticketId", updateTicket);
