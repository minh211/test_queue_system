import {
  CreationDoctorAttributes,
  CreationPatientAttributes,
  PublicDoctorAttributes,
  PublicLinkedTicketAttributes,
  PublicPatientAttributes,
  PublicQueueAttributes,
} from "./models";

export namespace ServerApi {
  export namespace AddDoctor {
    export type ReqBody = CreationDoctorAttributes;
    export type ResBody = PublicDoctorAttributes;
  }

  export namespace GetDoctors {
    export type ResBody = PublicDoctorAttributes[];
  }

  export namespace UpdateDoctor {
    export type ReqBody = Partial<CreationDoctorAttributes>;
  }

  export namespace AddPatient {
    export type ReqBody = CreationPatientAttributes;
    export type ResBody = PublicPatientAttributes;
  }

  export namespace GetQueue {
    export type ReqBody = PublicQueueAttributes;
  }

  export namespace AddQueue {
    export type ResBody = PublicQueueAttributes;
  }

  export namespace UpdateQueue {
    export type ReqBody = { isActive: false };
  }

  export namespace GetTickets {
    export type ResBody = PublicLinkedTicketAttributes[];
  }

  export namespace UpdateTicket {
    export type ReqBody = { isActive?: boolean; doctorId?: string };
  }
}
