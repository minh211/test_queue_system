import * as React from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { Doctor } from "./Doctors";
import { baseUrl } from "../Config/config";
import { UpdateDoctorModal } from "./UpdateDoctorModal";

interface DoctorListProps {
  refresh(): void;
  doctors: Doctor[];
  className?: string;
  toggleDuty(doctorId: string): Promise<void>;
  deleteDoctor(doctorId: string): Promise<void>;
}

const DoctorList: React.FC<DoctorListProps> = ({ refresh, doctors, className, toggleDuty, deleteDoctor }) => {
  const [modal, setModal] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [submitDisabled, setSubmitDisabled] = React.useState(true);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const toggle = React.useCallback(() => setModal((oldModal) => !oldModal), []);

  const validate = React.useCallback(() => {
    let errorMessages = [];
    if (!firstName) {
      errorMessages.push("First name field is required.");
    }
    if (!lastName) {
      errorMessages.push("Last name field is required.");
    }
    setErrorMessages(errorMessages);
    if (errorMessages.length === 0) {
      setSubmitDisabled(false);
    }
  }, [firstName, lastName]);

  const updateFirstName = React.useCallback(
    (value: string) => {
      setFirstName(() => value);
      validate();
    },
    [validate]
  );

  const updateLastName = React.useCallback(
    (value: string) => {
      setLastName(() => value);
      validate();
    },
    [validate]
  );

  const updateDoctor = React.useCallback(
    async (doctorId: string) => {
      try {
        let result = (
          await axios.put(`${baseUrl}/doctors/${doctorId}`, {
            doctorId,
            firstName,
            lastName,
          })
        ).data;
        if (result.success) {
          refresh();
        }
      } catch (e) {
        console.log(e);
      }

      setSubmitDisabled(false);
    },
    [firstName, lastName, refresh]
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
            doctors.map((doctor) => (
              <tr key={doctor.doctorId}>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td width="100" align="center">
                  <input type="checkbox" onChange={() => toggleDuty(doctor.doctorId)} checked={doctor.onDuty} />
                </td>
                <td width="100" align="center">
                  <div>
                    <Button outline color="warning" size="sm" onClick={toggle}>
                      Update
                    </Button>
                    <UpdateDoctorModal
                      {...doctor}
                      modal={modal}
                      toggle={toggle}
                      errorMessages={errorMessages}
                      updateFirstName={updateFirstName}
                      updateLastName={updateLastName}
                      className={className}
                      submitDisabled={submitDisabled}
                      updateDoctor={updateDoctor}
                    />
                  </div>
                  <Button outline color="danger" size="sm" onClick={() => deleteDoctor(doctor.doctorId)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default DoctorList;