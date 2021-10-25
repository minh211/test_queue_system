import { io } from "../io";
import { QueueServices } from "../services";
import { asyncHandler, createError } from "../utils";
import { ServerApi } from "../api";

const queuesNsp = io.of("/queues");

export const getQueues = asyncHandler<never, ServerApi.GetQueue.ReqBody, never, { active?: boolean }>(
  async (req, res) => {
    const queue = await QueueServices.getActiveQueue();

    if (!queue) {
      res.status(201).send();
      return;
    }

    res.status(200).send({
      isActive: queue.isActive,
      startDate: queue.startDate,
      endDate: queue.endDate,
      queueId: queue.id,
      tickets: queue.Tickets.map((ticket) => ({
        isActive: ticket.isActive,
        ticketNumber: ticket.ticketNumber,
        updatedAt: ticket.updatedAt,
        ticketId: ticket.id,
      })),
    });
  }
);

export const openQueue = asyncHandler<never, ServerApi.AddQueue.ResBody>(async (_req, res, next) => {
  const newQueue = await QueueServices.openQueue();

  if (!newQueue) {
    next(createError(409, "Can not create a new queue when a queue is active"));
    return;
  }

  res.status(201).send({ ...newQueue, queueId: newQueue.id, tickets: [] });

  queuesNsp.emit("openQueue");
});

export const updateQueue = asyncHandler<{ queueId: string }, never, ServerApi.UpdateQueue.ReqBody>(
  async (req, res, next) => {
    const { queueId } = req.params;
    const { isActive } = req.body;

    if (isActive !== false) {
      next(createError(409, "Unsupported the patch document"));
      return;
    }

    const success = await QueueServices.closeQueue(queueId);

    if (!success) {
      next(createError(409, `Can not close the queue with id ${queueId}`));
      return;
    }

    res.status(204).send();
    queuesNsp.emit("closeQueue");
  }
);
