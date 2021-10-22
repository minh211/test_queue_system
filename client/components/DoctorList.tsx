import * as React from "react";
import { Button } from "reactstrap";

import { AppContext } from "../AppContainer";
import { Doctor } from "../types";

import { UpdateDoctorModal } from "./UpdateDoctorModal";

export const DoctorList: React.FC = () => {
  const { doctors, eventHandlers } = React.useContext(AppContext);
  const [modal, setModal] = React.useState(false);

  const [currentDoctor, setCurrentDoctor] = React.useState<Doctor | undefined>(undefined);

  const toggleModal = React.useCallback(
    (doctorId: string) => {
      setModal((oldModal) => !oldModal);
      setCurrentDoctor(() => doctors.find((doctor) => doctor.doctorId === doctorId));
    },
    [doctors]
  );

  const toggleDuty = React.useCallback(
    async (doctorId: string) => {
      const doctor = doctors.find((d) => d.doctorId === doctorId);
      if (!doctor) {
        return;
      }

      eventHandlers.updateDoctor({ doctorId, onDuty: !doctor.onDuty }).then();
    },
    [doctors, eventHandlers]
  );

  const deleteDoctor = React.useCallback(
    async (doctorId: string) => {
      eventHandlers.deleteDoctor(doctorId).then();
    },
    [eventHandlers]
  );

  return (
    <React.Fragment>
      <table
        className="table table-striped table-hover table-bordered"
        style={{ marginTop: "20px", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th className="text-info">First Name</th>
            <th className="text-info">Last Name</th>
            <th className="text-info">On Duty</th>
            <th className="text-info">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 && (
            <tr>
              <td colSpan={6}>No doctors. Add a doctor to start.</td>
            </tr>
          )}
          {doctors.length > 0 &&
            doctors.map((doctor, i) => (
              <tr key={i}>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td width="100" align="center">
                  <input type="checkbox" onChange={() => toggleDuty(doctor.doctorId)} checked={doctor.onDuty} />
                </td>
                <td width="100" align="center">
                  <div>
                    <Button outline color="warning" size="sm" onClick={() => toggleModal(doctor.doctorId)}>
                      Update
                    </Button>
                  </div>
                  <Button outline color="danger" size="sm" onClick={() => deleteDoctor(doctor.doctorId)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
        {modal && (
          <UpdateDoctorModal
            doctor={currentDoctor}
            modal={modal}
            toggleModal={() => setModal((oldModal) => !oldModal)}
          />
        )}
      </table>
    </React.Fragment>
  );
};
