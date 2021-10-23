import { Router } from "express";

import { closeQueue, getQueues, openQueue } from "../../controllers";

export const queuesRouter = Router();

queuesRouter.get("", getQueues);
queuesRouter.post("", openQueue);
queuesRouter.patch("/:queueId", closeQueue);
