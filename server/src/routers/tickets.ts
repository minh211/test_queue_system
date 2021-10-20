import { Router } from "express";

import { updateTicket, getAllTickets } from "../controllers";

export const ticketsRouter = Router();

ticketsRouter.get("/", getAllTickets);
ticketsRouter.patch("/:ticketId", updateTicket);
