import { Router } from "express";

import { updateTicket, getTickets } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares";

export const ticketsRouter = Router();

ticketsRouter.get("/", getTickets);
ticketsRouter.patch("/:ticketId", authenticateMiddleware, updateTicket);
