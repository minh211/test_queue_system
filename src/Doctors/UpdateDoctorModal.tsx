import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as React from "react";

interface UpdateDoctorModalProps {
  modal: boolean;
  toggle(): void;

  doctorId: string;
  className?: string;
  firstName: string;
  lastName: string;
  errorMessages: string[];
  submitDisabled: boolean;

  updateFirstName(value: string): void;
  updateLastName(value: string): void;
  updateDoctor(doctorId: string): void;
}

export const UpdateDoctorModal: React.FC<UpdateDoctorModalProps> = ({
  modal,
  toggle,
  className,
  updateFirstName,
  updateLastName,
  updateDoctor,
  firstName,
  lastName,
  errorMessages,
  submitDisabled,
  doctorId,
}) => {
  return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>Update Doctor</ModalHeader>

      <ModalBody>
        <div className="form-group" style={{ marginTop: "20px" }}>
          {errorMessages.length > 0 && (
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
        <Button color="primary" onClick={() => updateDoctor(doctorId)} disabled={submitDisabled}>
          Edit
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
