import express from "express";

import { closeActiveQueue, getQueues, openNewQueue } from "../controllers/queueController";

const queuesRouter = express.Router();

queuesRouter.get("", getQueues);
queuesRouter.post("", openNewQueue);
queuesRouter.patch("/:queueId", closeActiveQueue);

export { queuesRouter };
