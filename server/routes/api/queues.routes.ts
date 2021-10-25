import { Router } from "express";

import { updateQueue, getQueues, openQueue } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares";

export const queuesRouter = Router();

queuesRouter.use(authenticateMiddleware);
queuesRouter.get("", getQueues);
queuesRouter.post("", openQueue);
queuesRouter.patch("/:queueId", updateQueue);
