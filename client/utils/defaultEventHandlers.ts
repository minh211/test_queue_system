import { EventHandlers } from "../types";

export const defaultEventHandlers: EventHandlers = {
  signIn(): Promise<void> {
    return Promise.resolve(undefined);
  },
  signOut(): Promise<void> {
    return Promise.resolve(undefined);
  },
  addDoctor(): Promise<void> {
    return Promise.resolve(undefined);
  },
  addPatient(): Promise<void> {
    return Promise.resolve(undefined);
  },
  deleteDoctor(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getDoctors(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getOnDutyDoctors(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getQueue(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getTickets(): Promise<void> {
    return Promise.resolve(undefined);
  },
  updateDoctor(): Promise<void> {
    return Promise.resolve(undefined);
  },
  updateTickets(): Promise<void> {
    return Promise.resolve(undefined);
  },
  closeQueue(): Promise<void> {
    return Promise.resolve(undefined);
  },
  openQueue(): Promise<void> {
    return Promise.resolve(undefined);
  },
};
