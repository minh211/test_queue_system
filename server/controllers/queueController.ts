import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

import { Queue, QueueAttributes, Ticket, TicketAttributes } from "../models";
import { getIo } from "../io";
import { ResponseMessage } from "../types";

const io = getIo();
const home = io?.of("/").on("connection", () => {
  console.log("Connected from Home page.");
});

export namespace GetQueuesHandler {
  export type ReqQuery = { active?: boolean };
  export type ResBody =
    | ResponseMessage
    | (Pick<QueueAttributes, "isActive" | "startDate" | "endDate"> & {
        queueId: string;
        tickets: TicketAttributes[];
      });
}

export const getQueues: RequestHandler<never, GetQueuesHandler.ResBody, never, GetQueuesHandler.ReqQuery> =
  asyncHandler(async (req, res) => {
    console.log("@");
    const { active } = req.query;

    const activeQueues = await Queue.findAll({
      attributes: ["id", "startDate", "endDate", "isActive"],
      where: active ? { isActive: true } : undefined,
      include: [{ model: Ticket }],
    });

    if (activeQueues.length === 0) {
      res.status(404).send({ message: `Can not find ${active ? "active queue" : "any queues"}` });
      return;
    }
    console.log({ activeQueues });

    res.status(200).send({
      queueId: activeQueues[0].id,
      isActive: activeQueues[0].isActive,
      startDate: activeQueues[0].startDate,
      endDate: activeQueues[0].endDate,
      tickets: activeQueues[0].Tickets,
    });
  });

export namespace OpenQueueHandler {
  export type ResBody = ResponseMessage | (Omit<QueueAttributes, "id"> & { queueId: string });
}

export const openNewQueue: RequestHandler<never, OpenQueueHandler.ResBody> = asyncHandler(async (_req, res) => {
  const activeQueues = await Queue.findAll({ where: { isActive: true } });

  if (activeQueues.length > 0) {
    res.status(200).send({ message: "Can not create a new queue when a queue is active" });
    return;
  }

  const queue = await Queue.create({ isActive: true, startDate: new Date() });

  res.status(201).send({
    queueId: queue.id,
    startDate: queue.startDate,
    isActive: queue.isActive,
    endDate: queue.endDate,
  });
});

export namespace CloseActiveQueueHandler {
  export type ReqParams = { queueId: string };
  export type ReqBody = { isActive?: false };
  export type ResBody = never | ResponseMessage;
}

export const closeActiveQueue: RequestHandler<
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

  const queue = await Queue.findByPk(queueId);

  if (!queue) {
    res.status(409).send({ message: `Can not find the queue with id ${queueId}` });
    return;
  }

  if (!queue.isActive) {
    res.status(409).send({ message: `The queue is already close` });
    return;
  }

  await queue.update({ isActive: false, endDate: new Date() });
  res.status(204).send();

  home?.emit("closeQueue");
});
