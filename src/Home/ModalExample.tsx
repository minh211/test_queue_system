import * as React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { baseUrl } from "../Config/config";
import axios from "axios";

export interface ModelExampleProps {
  className: string;
}

const ModalExample: React.FC<ModelExampleProps> = (props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [onDuty, setOnDuty] = React.useState(true);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [modal, setModal] = React.useState(false);

  const toggle = React.useCallback(() => {
    setModal((oldModal) => !oldModal);
  }, []);

  const validate = React.useCallback(() => {
    let errorMessages = [];
    if (!firstName) {
      errorMessages.push("First name field is required.");
    }
    if (!lastName) {
      errorMessages.push("Last name field is required.");
    }
    setErrorMessages(errorMessages);
  }, [firstName, lastName]);

  const updateFirstName = React.useCallback(
    (value: string) => {
      setFirstName(value);
      validate();
    },
    [validate]
  );

  const updateLastName = React.useCallback(
    (value) => {
      setLastName(value);
      validate();
    },
    [validate]
  );

  const updateOnDuty = React.useCallback(() => {
    setOnDuty((oldOnDuty) => !oldOnDuty);
    validate();
  }, [validate]);

  const update = React.useCallback(
    async (doctorId) => {
      await axios
        .put(`${baseUrl}/doctors/${doctorId}`, {
          firstName,
          lastName,
          onDuty,
        })
        .then((response) => {
          reset();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    [firstName, lastName, onDuty]
  );

  const reset = () => {
    setFirstName("");
    setLastName("");
    setOnDuty(true);
    setErrorMessages([]);
  };

  return (
    <div>
      <Button outline color="info" size="sm" onClick={toggle}>
        Edit
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={props.className}>
        <ModalHeader toggle={toggle}>Edit Doctor</ModalHeader>

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
            <label htmlFor="firstName" className="text-danger">
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
            <label htmlFor="lastName" className="text-danger">
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
          <div className="form-check" style={{ marginBottom: "20px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="onDuty"
              onChange={() => updateOnDuty()}
              checked={onDuty}
            />
            <label className="form-check-label" htmlFor="onDuty">
              On Duty
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              // @ts-ignore
              update();
            }}>
            Edit
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalExample;
