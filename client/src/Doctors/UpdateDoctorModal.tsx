import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as React from "react";
import axios from "axios";

import { baseUrl } from "../Config/config";

import { Doctor } from "./Doctors";
import { useNames } from "./useNames";

interface UpdateDoctorModalProps {
  modal: boolean;
  toggleModal(): void;
  refresh(): void;

  doctor?: Doctor;
}

export const UpdateDoctorModal: React.FC<UpdateDoctorModalProps> = ({ modal, toggleModal, doctor, refresh }) => {
  const { firstName, lastName, errorMessages, updateFirstName, updateLastName, isValid, isEditing } = useNames(doctor);

  const updateDoctor = React.useCallback(async () => {
    try {
      const result = (
        await axios.put(`${baseUrl}/doctors/${doctor?.doctorId}`, {
          doctorId: doctor?.doctorId,
          firstName,
          lastName,
        })
      ).data;
      if (result.success) {
        refresh();
        toggleModal();
      }
    } catch (e) {
      console.log(e);
    }
  }, [doctor?.doctorId, firstName, lastName, refresh]);

  if (!modal) {
    return null;
  }

  return (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Update Doctor</ModalHeader>

      <ModalBody>
        <div className="form-group" style={{ marginTop: "20px" }}>
          {isEditing && errorMessages.length > 0 && (
            <div className="alert alert-danger" role="alert">
              {errorMessages.map((errorMessage) => (
                <li key={errorMessage}>{errorMessage}</li>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="firstName" className="info">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First Name"
            onBlur={(e) => updateFirstName(e.target.value)}
            onChange={(e) => updateFirstName(e.target.value)}
            value={firstName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="text-info">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Last Name"
            onBlur={(e) => updateLastName(e.target.value)}
            onChange={(e) => updateLastName(e.target.value)}
            value={lastName}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={updateDoctor} disabled={!isValid}>
          Edit
        </Button>{" "}
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
