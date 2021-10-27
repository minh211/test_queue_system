import { Queue, QueueModel, Ticket } from "../models";

export namespace QueueServices {
  export async function getActiveQueue(): Promise<QueueModel | undefined> {
    const queues = await Queue.findAll({
      attributes: ["id", "startDate", "endDate", "isActive"],
      where: { isActive: true },
      include: [{ model: Ticket }],
    });

    if (queues.length === 0) {
      return undefined;
    }

    return queues[0];
  }

  export async function openQueue(): Promise<QueueModel | undefined> {
    const activeQueue = await getActiveQueue();

    if (activeQueue) {
      return undefined;
    }

    return await Queue.create({ isActive: true, startDate: new Date() });
  }

  export async function closeQueue(queueId: string): Promise<boolean> {
    const queue = await Queue.findByPk(queueId);

    if (!queue || !queue.isActive) {
      return false;
    }

    await queue.update({ isActive: false, endDate: new Date() });

    return true;
  }
}
