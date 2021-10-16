import * as React from "react";
import axios, { AxiosResponse } from "axios";
import NewDoctor from "./NewDoctor";
import AllDoctors from "./AllDoctors";
import { baseUrl } from "../Config/config";

export interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  onDuty: boolean;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  const refresh = React.useCallback(
    async (): Promise<AxiosResponse<Doctor[]>> => axios.get(`${baseUrl}/doctors/getalldoctors`),
    []
  );

  React.useEffect(() => {
    refresh().then(({ data }) => setDoctors(() => data));
  }, [refresh]);

  const deleteDoctor = React.useCallback(async (doctorId: string) => {
    try {
      let result = (
        await axios.delete(`${baseUrl}/doctors/${doctorId}`, {
          data: { doctorId },
        })
      ).data;
      if (result.success) {
        let doctors = (await axios.get(`${baseUrl}/doctors/getalldoctors`)).data;
        setDoctors(() => doctors);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const toggleDuty = React.useCallback(async (doctorId: string) => {
    try {
      let result = (
        await axios.post(`${baseUrl}/doctors/toggleduty`, {
          doctorId,
        })
      ).data;

      if (result.success) {
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
  }, []);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewDoctor refresh={refresh} />
          </div>
          <div className="col-8 card">
            <AllDoctors doctors={doctors} toggleDuty={toggleDuty} deleteDoctor={deleteDoctor} refresh={refresh} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Doctors;
