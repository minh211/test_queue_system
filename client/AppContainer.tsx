import axios, { AxiosResponse as Res } from "axios";
import * as React from "react";

import { AddDoctorHandler, GetDoctorsHandler, GetQueuesHandler, GetTicketsHandler } from "../server/controllers";

import { apiUrl, defaultEventHandlers } from "./utils";
import { AppContextType, Doctor, OnDutyDoctor, Patient, Queue, Ticket, EventHandlers, NewTicket } from "./types";

function isSuccess(response: Res) {
  return response.status < 300;
}

export const AppContainer: React.FC = ({ children }) => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [queue, setQueue] = React.useState<Queue | undefined>(undefined);
  const [onDutyDoctors, setOnDutyDoctors] = React.useState<OnDutyDoctor[]>([]);

  const newTickets: NewTicket[] = React.useMemo(() => {
    return tickets.filter(({ doctor }) => !doctor);
  }, [tickets]);

  const doneTickets: Ticket[] = React.useMemo(() => {
    return tickets.filter(({ isActive }) => !isActive);
  }, [tickets]);

  const getDoctors = React.useCallback(async () => {
    const res: Res<GetDoctorsHandler.AllDoctorsResBody> = await axios.get(`${apiUrl}/doctors`);
    if (isSuccess(res)) {
      setDoctors(() => res.data);
    }
  }, []);

  const deleteDoctor = React.useCallback(
    async (doctorId: string) => {
      const res: Res = await axios.delete(`${apiUrl}/doctors/${doctorId}`, { data: { doctorId } });

      if (isSuccess(res)) {
        await getDoctors();
      }
    },
    [getDoctors]
  );

  const updateDoctor: EventHandlers["updateDoctor"] = React.useCallback(async (updateDoctor) => {
    const { doctorId, ...updatePart } = updateDoctor;
    const res: Res = await axios.patch(`${apiUrl}/doctors/${updateDoctor.doctorId}`, { ...updatePart });

    if (!isSuccess(res)) {
      return;
    }

    setDoctors((oldDoctors) =>
      oldDoctors.map((oldDoctor) => {
        if (oldDoctor.doctorId !== doctorId) {
          return oldDoctor;
        }

        return {
          ...oldDoctor,
          firstName: updateDoctor.firstName ?? oldDoctor.firstName,
          lastName: updateDoctor.lastName ?? oldDoctor.firstName,
          onDuty: updateDoctor.onDuty ?? oldDoctor.onDuty,
        };
      })
    );
  }, []);

  const addDoctor: EventHandlers["addDoctor"] = React.useCallback(async (doctor) => {
    const res: Res<AddDoctorHandler.ResBody> = await axios.post(`${apiUrl}/doctors`, doctor);

    if (isSuccess(res)) {
      setDoctors((oldDoctors) => [...oldDoctors, res.data]);
    }
  }, []);

  const getTickets: EventHandlers["getTickets"] = React.useCallback(async () => {
    const res: Res<GetTicketsHandler.ResBody> = await axios.get(`${apiUrl}/tickets`);
    if (isSuccess(res)) {
      setTickets(() => res.data);
    }
  }, []);

  const getQueue: EventHandlers["getQueue"] = React.useCallback(async () => {
    const res: Res<GetQueuesHandler.QueueResBody> = await axios.get(`${apiUrl}/queues?active=true`);
    if (isSuccess(res)) {
      setQueue(() => res.data);
    }
  }, []);

  const getOnDutyDoctors = React.useCallback(async () => {
    const res: Res<GetDoctorsHandler.OnDutyDoctorsResBody> = await axios.get(`${apiUrl}/doctors?onDuty=true`);

    if (isSuccess(res)) {
      setOnDutyDoctors(() => res.data);
    }
  }, []);

  const openQueue = React.useCallback(async () => {
    await axios.post(`${apiUrl}/queues`);
    await getQueue();
  }, [getQueue]);

  const closeQueue = React.useCallback(async () => {
    if (!queue) {
      return;
    }

    const res: Res = await axios.patch(`${apiUrl}/queues/${queue.queueId}`, { isActive: false });
    if (isSuccess(res)) {
      setQueue(undefined);
    }
  }, [queue]);

  const addPatient: EventHandlers["addPatient"] = React.useCallback(
    async (patient) => {
      const res: Res = await axios.post(`${apiUrl}/patients`, patient);

      if (isSuccess(res)) {
        setPatients((oldPatients) => [...oldPatients, res.data]);
        await getTickets();
      }
    },

    [getTickets]
  );

  const updateTickets = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      if (!ticketId && tickets.length > 0) {
        const unassignedTickets = tickets.filter((ticket) => ticket.doctor === undefined);
        if (unassignedTickets.length > 0) {
          await axios.patch(`${apiUrl}/tickets/${unassignedTickets[0].ticketId}`, { doctorId });
          await getTickets();
          await getOnDutyDoctors();
        }
      } else if (ticketId) {
        await axios.patch(`${apiUrl}/tickets/${ticketId}`, { isActive: false });
        await getTickets();
        await getOnDutyDoctors();
      }
    },
    [getOnDutyDoctors, getTickets, tickets]
  );

  React.useEffect(() => {
    getDoctors().then();
    getOnDutyDoctors().then();
    getTickets().then();
    getQueue().then();
  }, [getDoctors, getOnDutyDoctors, getQueue, getTickets]);

  const eventHandlers: EventHandlers = React.useMemo(() => {
    return {
      getDoctors,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      addPatient,
      getTickets,
      getQueue,
      updateTickets,
      getOnDutyDoctors,
      openQueue,
      closeQueue,
    };
  }, [
    addDoctor,
    addPatient,
    closeQueue,
    updateTickets,
    deleteDoctor,
    getDoctors,
    getOnDutyDoctors,
    getQueue,
    getTickets,
    openQueue,
    updateDoctor,
  ]);

  return (
    <AppContextProvider
      value={{
        onDutyDoctors,
        doctors,
        patients,
        newTickets,
        tickets,
        doneTickets,
        queue,
        eventHandlers,
      }}>
      {children}
    </AppContextProvider>
  );
};

export const AppContext = React.createContext<AppContextType>({
  doctors: [],
  onDutyDoctors: [],
  patients: [],
  newTickets: [],
  tickets: [],
  doneTickets: [],
  eventHandlers: defaultEventHandlers,
});

const AppContextProvider = AppContext.Provider;
