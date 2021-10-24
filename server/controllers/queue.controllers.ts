import { RequestHandler } from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";

import { QueueAttributes, TicketAttributes } from "../models";
import { ResponseMessage } from "../types";
import { io } from "../io";
import { QueueServices } from "../services";

const queuesNsp = io.of("/queues");

export namespace GetQueuesHandler {
  export type ReqQuery = { active?: boolean };
  export type QueueResBody =
    | undefined
    | (Pick<QueueAttributes, "isActive" | "startDate" | "endDate"> & {
        queueId: string;
        tickets: TicketAttributes[];
      });
  export type ResBody = QueueResBody;
}

export const getQueues: RequestHandler<never, GetQueuesHandler.ResBody, never, GetQueuesHandler.ReqQuery> =
  asyncHandler(async (req, res) => {
    const queue = await QueueServices.getQueue(req.query.active);

    if (!queue) {
      res.status(201).send();
      return;
    }

    res.status(200).send({
      isActive: queue.isActive,
      startDate: queue.startDate,
      endDate: queue.endDate,
      queueId: queue.id,
      tickets: queue.Tickets,
    });
  });

export namespace OpenQueueHandler {
  export type ResBody = ResponseMessage | (Omit<QueueAttributes, "id"> & { queueId: string });
}

export const openQueue: RequestHandler<never, OpenQueueHandler.ResBody> = asyncHandler(async (_req, res) => {
  const newQueue = await QueueServices.openQueue();

  if (!newQueue) {
    res.status(200).send({ message: "Can not create a new queue when a queue is active" });
    return;
  }

  res.status(201).send({
    ...newQueue,
    queueId: newQueue.id,
  });
  queuesNsp.emit("openQueue");
});

export namespace CloseActiveQueueHandler {
  export type ReqParams = { queueId: string };
  export type ReqBody = { isActive?: false };
  export type ResBody = never | ResponseMessage;
}

export const closeQueue: RequestHandler<
  CloseActiveQueueHandler.ReqParams,
  CloseActiveQueueHandler.ResBody,
  CloseActiveQueueHandler.ReqBody
> = asyncHandler(async (req, res) => {
  const { queueId } = req.params;
  const { isActive } = req.body;

  if (isActive !== false) {
    res.status(409).send({ message: "Unsupported the patch document" });
    return;
  }

  const success = await QueueServices.closeQueue(queueId);

  if (!success) {
    res.status(409).send({ message: `Can not close the queue with id ${queueId}` });
    return;
  }

  res.status(204).send();
  queuesNsp.emit("closeQueue");
});
