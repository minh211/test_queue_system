import { RequestHandler } from "express";

import { Queue, Ticket } from "../models";
import { getIo } from "../io";

import { MutationResponse } from "./doctorController";

const io = getIo();
const home = io?.of("/").on("connection", () => {
  console.log("Connected from Home page.");
});

export const getActiveQueues: RequestHandler = async function (_req, res) {
  const queue = await Queue.findAll({
    attributes: ["id", "startDate"],
    where: { isActive: true },
    include: [{ model: Ticket }],
  });
  res.send(queue);
};

export const openNewQueue: RequestHandler = async function (_req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };

  try {
    const activeQueue = await Queue.findAll({ where: { isActive: true } });
    if (activeQueue.length !== 0) {
      result.success = false;
      result.message = "There is an active queue. Close this queue before opening a new one.";
    } else {
      await Queue.create({ isActive: true, startDate: new Date() });
      result.success = true;
      result.message = "Successfully opened a new queue.";
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};

export const closeActiveQueue: RequestHandler = async function (_req, res) {
  const result: MutationResponse = {
    success: false,
    message: null,
  };
  try {
    const activeQueues = await Queue.findAll({ where: { isActive: true } });
    if (activeQueues.length === 0) {
      result.success = false;
      result.message = "No active queue to close.";
    } else {
      const activeQueue = activeQueues[0];
      await activeQueue.update({ isActive: false, endDate: new Date() });
      result.success = true;
      result.message = "Active queue has been successfully closed.";
      home?.emit("closeQueue");
    }
  } catch (e: any) {
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
};
