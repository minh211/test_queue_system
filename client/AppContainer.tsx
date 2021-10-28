import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { useHistory } from "react-router-dom";

import { ServerApi } from "../server/api";

import { baseUrl, defaultEventHandlers, useAxios } from "./utils";
import { AppContextType, Doctor, OnDutyDoctor, Patient, Queue, Ticket, EventHandlers } from "./types";

function isSuccess(response: AxiosResponse) {
  return response.status < 300;
}

export const AppContainer: React.FC = ({ children }) => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [queue, setQueue] = React.useState<Queue | undefined>(undefined);
  const [onDutyDoctors, setOnDutyDoctors] = React.useState<OnDutyDoctor[]>([]);
  const [authenticateError, setAuthenticateError] = React.useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);

  const history = useHistory();
  const { axiosGet, axiosPatch, axiosPost, axiosDelete } = useAxios(accessToken);

  const getDoctors = React.useCallback(async () => {
    const res = await axiosGet<ServerApi.GetDoctors.ResBody>("/doctors");

    if (isSuccess(res)) {
      setDoctors(() => res.data);
    }
  }, [axiosGet]);

  const deleteDoctor = React.useCallback(
    async (doctorId: string) => {
      const res = await axiosDelete(`/doctors/${doctorId}`);

      if (isSuccess(res)) {
        await getDoctors();
      }
    },
    [axiosDelete, getDoctors]
  );

  const updateDoctor: EventHandlers["updateDoctor"] = React.useCallback(
    async (updateDoctor) => {
      const res = await axiosPatch<ServerApi.UpdateDoctor.ReqBody>(`/doctors/${updateDoctor.doctorId}`, updateDoctor);

      if (!isSuccess(res)) {
        return;
      }

      setDoctors((oldDoctors) =>
        oldDoctors.map((oldDoctor) => {
          if (oldDoctor.doctorId !== updateDoctor.doctorId) {
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
    },
    [axiosPatch]
  );

  const addDoctor: EventHandlers["addDoctor"] = React.useCallback(
    async (doctor) => {
      const res = await axiosPost<ServerApi.AddDoctor.ReqBody, ServerApi.AddDoctor.ResBody>(`/doctors`, {
        ...doctor,
        onDuty: doctor.onDuty || false,
      });

      if (isSuccess(res)) {
        setDoctors((oldDoctors) => [...oldDoctors, res.data]);
      }
    },
    [axiosPost]
  );

  const getTickets: EventHandlers["getTickets"] = React.useCallback(async () => {
    const res = await axiosGet<ServerApi.GetTickets.ResBody>(`/tickets`);
    if (isSuccess(res)) {
      setTickets(() => res.data);
    }
  }, [axiosGet]);

  const getQueue: EventHandlers["getQueue"] = React.useCallback(async () => {
    const res = await axiosGet<ServerApi.GetQueue.ReqBody>(`/queues`);
    if (isSuccess(res)) {
      setQueue(() => res.data);
    }
  }, [axiosGet]);

  const getOnDutyDoctors = React.useCallback(async () => {
    const res = await axiosGet<ServerApi.GetDoctors.ResBody>(`/doctors?onDuty=true`);

    if (isSuccess(res)) {
      setOnDutyDoctors(() => res.data);
    }
  }, [axiosGet]);

  const openQueue = React.useCallback(async () => {
    const res = await axiosPost<never, ServerApi.AddQueue.ResBody>(`/queues`);
    setQueue(() => res.data);
  }, [axiosPost]);

  const closeQueue = React.useCallback(async () => {
    if (!queue) {
      return;
    }

    const res = await axiosPatch<ServerApi.UpdateQueue.ReqBody>(`/queues/${queue.queueId}`, { isActive: false });
    if (isSuccess(res)) {
      setQueue(undefined);
    }
  }, [axiosPatch, queue]);

  const addPatient: EventHandlers["addPatient"] = React.useCallback(
    async (patient) => {
      const res = await axiosPost<ServerApi.AddPatient.ReqBody, ServerApi.AddPatient.ResBody>(`/patients`, patient);

      if (isSuccess(res)) {
        setPatients((oldPatients) => [...oldPatients, res.data]);
        await getTickets();
      }
    },

    [axiosPost, getTickets]
  );

  const updateTickets = React.useCallback(
    async (doctorId: string, ticketId?: string) => {
      if (!ticketId && tickets.length > 0) {
        const unassignedTickets = tickets.filter((ticket) => ticket.doctor === undefined);
        if (unassignedTickets.length > 0) {
          await axiosPatch<ServerApi.UpdateTicket.ReqBody>(`/tickets/${unassignedTickets[0].ticketId}`, { doctorId });
          await getTickets();
          await getOnDutyDoctors();
        }
      } else if (ticketId) {
        await axiosPatch<ServerApi.UpdateTicket.ReqBody>(`/tickets/${ticketId}`, { isActive: false });
        await getTickets();
        await getOnDutyDoctors();
      }
    },
    [axiosPatch, getOnDutyDoctors, getTickets, tickets]
  );

  const signIn = React.useCallback(
    async (username: string, password: string) => {
      try {
        const res: AxiosResponse<{ accessToken: string }> = await axios.post(`${baseUrl}/auth/signIn`, {
          username,
          password,
        });
        if (isSuccess(res)) {
          setAccessToken(res.data.accessToken);
          history.push("/doctors");
        }
      } catch (e) {
        setAuthenticateError((e as any).toString());
      }
    },
    [history]
  );

  const signOut = React.useCallback(async () => setAccessToken(undefined), []);

  const eventHandlers: EventHandlers = React.useMemo(() => {
    return {
      signOut,
      signIn,
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
    signOut,
    signIn,
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
  ]);

  return (
    <AppContextProvider
      value={{
        accessToken,
        authenticateError,
        onDutyDoctors,
        doctors,
        patients,
        tickets,
        queue,
        eventHandlers,
      }}>
      {children}
    </AppContextProvider>
  );
};

export const AppContext = React.createContext<AppContextType>({
  accessToken: undefined,
  doctors: [],
  onDutyDoctors: [],
  patients: [],
  tickets: [],
  eventHandlers: defaultEventHandlers,
});

const AppContextProvider = AppContext.Provider;
