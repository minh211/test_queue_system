import { Router } from "express";

import { updateTicket, getTickets } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares/authenticate.middlewares";

export const ticketsRouter = Router();

ticketsRouter.use(authenticateMiddleware);
ticketsRouter.get("/", getTickets);
ticketsRouter.patch("/:ticketId", updateTicket);
