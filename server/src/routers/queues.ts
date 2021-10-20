import { Router } from "express";

import { closeActiveQueue, getQueues, openNewQueue } from "../controllers";

export const queuesRouter = Router();

queuesRouter.get("", getQueues);
queuesRouter.post("", openNewQueue);
queuesRouter.patch("/:queueId", closeActiveQueue);
