import { Router } from "express";

import { updateQueue, getQueues, openQueue } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares";

export const queuesRouter = Router();

queuesRouter.get("", getQueues);
queuesRouter.post("", authenticateMiddleware, openQueue);
queuesRouter.patch("/:queueId", authenticateMiddleware, updateQueue);
