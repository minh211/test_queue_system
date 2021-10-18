import express from "express";

import { closeActiveQueue, getActiveQueues, openNewQueue } from "../controllers/queueController";

const queuesRouter = express.Router();

queuesRouter.post("/queue", openNewQueue);

queuesRouter.delete("/queue", closeActiveQueue);

queuesRouter.get("/", getActiveQueues);

export { queuesRouter };
