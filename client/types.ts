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
  doctor?: { firstName: string; lastName: string; doctorId: string };
  patient: Patient;
}

export interface InProgressTicket extends Ticket {
  doctor: { firstName: string; lastName: string; doctorId: string };
}

export interface Queue {
  queueId: string;
  startDate: Date;
  endDate?: Date;
}

export interface AppContextType {
  accessToken: string | undefined;
  authenticateError?: string;
  queue?: Queue;
  doctors: Doctor[];
  onDutyDoctors: OnDutyDoctor[];
  patients: Patient[];
  tickets: Ticket[];
  eventHandlers: EventHandlers;
}

export interface EventHandlers {
  signIn(username: string, password: string): Promise<void>;
  signOut(): Promise<void>;
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
