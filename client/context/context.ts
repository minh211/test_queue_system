import * as React from "react";

import { Doctor, OnDutyDoctor, Patient, Queue, Ticket } from "../types";

import { defaultEventHandlers, EventHandlers } from "./eventHandlers";

export interface AppContextType {
  queue?: Queue;
  doctors: Doctor[];
  onDutyDoctors: OnDutyDoctor[];
  patients: Patient[];
  tickets: Ticket[];
  eventHandlers: EventHandlers;
}

export const AppContext = React.createContext<AppContextType>({
  doctors: [],
  onDutyDoctors: [],
  patients: [],
  tickets: [],
  eventHandlers: defaultEventHandlers,
});

export const AppContextProvider = AppContext.Provider;
