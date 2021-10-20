import { Doctor, Patient } from "../types";

export interface EventHandlers {
  getDoctors(): Promise<void>;
  getOnDutyDoctors(): Promise<void>;
  deleteDoctor(doctorId: string): Promise<void>;
  addDoctor(doctor: Omit<Doctor, "doctorId">): Promise<void>;
  updateDoctor(doctor: Pick<Doctor, "doctorId"> & Partial<Omit<Doctor, "doctorId">>): Promise<void>;

  addPatient(patient: Omit<Patient, "patientId">): Promise<void>;

  getTickets(): Promise<void>;
  closeTicket(doctorId: string, ticketId?: string): Promise<void>;

  getQueue(): Promise<void>;
  closeQueue(): Promise<void>;
  openQueue(): Promise<void>;
}

export const defaultEventHandlers: EventHandlers = {
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
  closeTicket(): Promise<void> {
    return Promise.resolve(undefined);
  },
  closeQueue(): Promise<void> {
    return Promise.resolve(undefined);
  },
  openQueue(): Promise<void> {
    return Promise.resolve(undefined);
  },
};
