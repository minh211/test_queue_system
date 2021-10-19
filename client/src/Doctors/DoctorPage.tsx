import * as React from "react";
import axios, { AxiosResponse } from "axios";

import { baseUrl } from "../Config/config";

import NewDoctor from "./NewDoctor";
import DoctorList from "./DoctorList";

export type MutationResponse = AxiosResponse<{ success: boolean }>;

export interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  const refresh = React.useCallback(async () => {
    const response: AxiosResponse<Doctor[]> = await axios.get(`${baseUrl}/doctors`);
    setDoctors(() => response.data);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteDoctor = React.useCallback(async (doctorId: string) => {
    try {
      const deleteResponse: MutationResponse = await axios.delete(`${baseUrl}/doctors/${doctorId}`, {
        data: { doctorId },
      });

      if (deleteResponse.data.success) {
        const doctorsResponse: AxiosResponse<Doctor[]> = await axios.get(`${baseUrl}/doctors`);
        setDoctors(() => doctorsResponse.data);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const toggleDuty = React.useCallback(
    async (doctorId: string) => {
      const targetDoctor = doctors.find((doctor) => doctor.doctorId === doctorId);
      if (!targetDoctor) {
        return;
      }

      try {
        const toggleResponse: MutationResponse = await axios.patch(`${baseUrl}/doctors/${doctorId}`, {
          onDuty: !targetDoctor.onDuty,
        });

        if (toggleResponse.data.success) {
          setDoctors((oldDoctors) =>
            oldDoctors.map((doctor) => {
              if (doctor.doctorId === doctorId) {
                return { ...doctor, onDuty: !doctor.onDuty };
              }

              return doctor;
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    [doctors]
  );

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewDoctor refresh={refresh} />
          </div>
          <div className="col-8 card">
            <DoctorList doctors={doctors} toggleDuty={toggleDuty} deleteDoctor={deleteDoctor} refresh={refresh} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DoctorPage;
