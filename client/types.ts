export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: Date;
  caseDescription?: string;
}

export interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}

export interface OnDutyDoctor {
  doctorId: string;
  lastName: string;
  firstName: string;

  ticket?: {
    ticketId: string;
    ticketNumber: number;
  };

  patient?: {
    firstName: string;
    lastName: string;
  };
}

export interface Ticket {
  ticketId: string;
  isActive: boolean;
  updatedAt: Date;
  ticketNumber: number;
  doctor: { firstName: string; lastName: string; doctorId: string } | undefined;
  patient: Patient;
}

export type NewTicket = Omit<Ticket, "doctor">;

export interface Queue {
  queueId: string;
  startDate: Date;
  endDate?: Date;
}

export interface AppContextType {
  queue?: Queue;
  doctors: Doctor[];
  onDutyDoctors: OnDutyDoctor[];
  patients: Patient[];
  tickets: Ticket[];
  eventHandlers: EventHandlers;
  newTickets: NewTicket[];
  doneTickets: Ticket[];
}

export interface EventHandlers {
  getDoctors(): Promise<void>;
  getOnDutyDoctors(): Promise<void>;
  deleteDoctor(doctorId: string): Promise<void>;
  addDoctor(doctor: Omit<Doctor, "doctorId">): Promise<void>;
  updateDoctor(doctor: Pick<Doctor, "doctorId"> & Partial<Omit<Doctor, "doctorId">>): Promise<void>;

  addPatient(patient: Omit<Patient, "patientId">): Promise<void>;

  getTickets(): Promise<void>;
  updateTickets(doctorId: string, ticketId?: string): Promise<void>;

  getQueue(): Promise<void>;
  closeQueue(): Promise<void>;
  openQueue(): Promise<void>;
}
