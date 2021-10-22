import axios, { AxiosResponse } from "axios";
import * as React from "react";

import { apiUrl } from "../Config/config";
import { MutationResponse } from "../Doctors/DoctorPage";
import { Doctor, OnDutyDoctor, Patient, Queue, Ticket } from "../types";

import { AppContextProvider } from "./context";
import { EventHandlers } from "./eventHandlers";

export const AppContainer: React.FC = ({ children }) => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [queue, setQueue] = React.useState<Queue | undefined>(undefined);
  const [onDutyDoctors, setOnDutyDoctors] = React.useState<OnDutyDoctor[]>([]);

  const getDoctors = React.useCallback(async () => {
    const response: AxiosResponse<Doctor[]> = await axios.get(`${apiUrl}/doctors`);
    setDoctors(() => response.data);
  }, []);

  const deleteDoctor = React.useCallback(
    async (doctorId: string) => {
      try {
        const deleteResponse: MutationResponse = await axios.delete(`${apiUrl}/doctors/${doctorId}`, {
          data: { doctorId },
        });

        if (deleteResponse.data.success) {
          getDoctors().then();
        }
      } catch (e) {
        console.log(e);
      }
    },
    [getDoctors]
  );

  const updateDoctor: EventHandlers["updateDoctor"] = React.useCallback(async (updateDoctor) => {
    const { doctorId, ...updatePart } = updateDoctor;
    try {
      const response: MutationResponse = await axios.patch(`${apiUrl}/doctors/${updateDoctor.doctorId}`, {
        ...updatePart,
      });

      if (response.data.success) {
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
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const addDoctor: EventHandlers["addDoctor"] = React.useCallback(async (doctor) => {
    // TODO: make server return new doctor
    await axios
      .post(`${apiUrl}/doctors`, doctor)
      .then((res) => {
        setDoctors((oldDoctors) => [...oldDoctors, res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  const addPatient: EventHandlers["addPatient"] = React.useCallback(async (patient) => {
    // TODO: make server return new doctor
    await axios
      .post(`${apiUrl}/patients`, patient)
      .then((res) => {
        setPatients((oldPatients) => [...oldPatients, res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  const getTickets: EventHandlers["getTickets"] = React.useCallback(async () => {
    await axios.get(`${apiUrl}/tickets`).then((res) => setTickets(() => res.data));
  }, []);

  const getQueue: EventHandlers["getQueue"] = React.useCallback(async () => {
    await axios.get(`${apiUrl}/queues?active=true`).then((res) => setQueue(() => res.data));
  }, []);

  const closeTicket = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      if (!ticketId) {
        if (tickets.length > 0) {
          await axios.patch(`${apiUrl}/tickets/${tickets[0].ticketId}`, { doctorId });
        }
      } else {
        await axios.patch(`${apiUrl}/tickets/${ticketId}`, { isActive: false });
      }
    },
    [tickets]
  );

  const getOnDutyDoctors = React.useCallback(async () => {
    await axios.get(`${apiUrl}/doctors?onDuty=true`).then((res) => {
      setOnDutyDoctors(() => res.data);
    });
  }, []);

  const openQueue = React.useCallback(async () => {
    await axios.post(`${apiUrl}/queues`);
  }, []);

  const closeQueue = React.useCallback(async () => {
    if (!queue) {
      return;
    }
    await axios.patch(`${apiUrl}/queues/${queue.id}`, { isActive: false });
  }, [queue]);

  React.useEffect(() => {
    getDoctors().then();
    getTickets().then();
    getQueue().then();
  }, [getDoctors, getQueue, getTickets]);

  const eventHandlers: EventHandlers = React.useMemo(() => {
    return {
      getDoctors,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      addPatient,
      getTickets,
      getQueue,
      closeTicket,
      getOnDutyDoctors,
      openQueue,
      closeQueue,
    };
  }, [
    addDoctor,
    addPatient,
    closeQueue,
    closeTicket,
    deleteDoctor,
    getDoctors,
    getOnDutyDoctors,
    getQueue,
    getTickets,
    openQueue,
    updateDoctor,
  ]);

  return (
    <AppContextProvider value={{ onDutyDoctors, doctors, patients, tickets, queue, eventHandlers }}>
      {children}
    </AppContextProvider>
  );
};
