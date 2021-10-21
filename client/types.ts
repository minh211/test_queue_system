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
  ticketNumber: number;
  doctor?: Doctor;
  patient: Patient;
}

export interface Queue {
  id: string;
  startDate: Date;
  endDate: Date | undefined;
}
