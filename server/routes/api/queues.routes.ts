import { Router } from "express";

import { closeQueue, getQueues, openQueue } from "../../controllers";
import { authenticateMiddleware } from "../../middlewares/authenticate.middlewares";

export const queuesRouter = Router();

queuesRouter.use(authenticateMiddleware);
queuesRouter.get("", getQueues);
queuesRouter.post("", openQueue);
queuesRouter.patch("/:queueId", closeQueue);
