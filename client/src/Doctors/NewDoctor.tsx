import * as React from "react";
import axios from "axios";

import { baseUrl } from "../Config/config";

import { useNames } from "./useNames";

export interface NewDoctorProps {
  refresh(): void;
}

const NewDoctor: React.FC<NewDoctorProps> = (props) => {
  const {
    firstName,
    lastName,
    onDuty,
    reset,
    setFirstName,
    setLastName,
    errorMessages,
    toggleDuty,
    isEditing,
    isValid,
  } = useNames();

  const submit = async () => {
    await axios
      .post(`${baseUrl}/doctors`, { firstName, lastName, onDuty })
      .then(() => {
        reset();
        props.refresh();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <div className="container card" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div className="form-group" style={{ marginTop: "20px" }}>
          <h4 className="text-danger">Add Doctor</h4>
          {isEditing && errorMessages.length > 0 && (
            <div className="alert alert-danger" role="alert">
              {errorMessages.map((errorMessage) => (
                <li key={errorMessage}>{errorMessage}</li>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="firstName" className="text-info">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First Name"
            onBlur={(e) => setFirstName(e.target.value)}
            onChange={(e) => setFirstName(e.target.value)}
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
            onBlur={(e) => setLastName(e.target.value)}
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </div>
        <div className="form-check" style={{ marginBottom: "20px" }}>
          <input
            className="form-check-input"
            type="checkbox"
            id="onDuty"
            onChange={() => toggleDuty()}
            checked={onDuty}
          />
          <label className="form-check-label" htmlFor="onDuty">
            On Duty
          </label>
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!isValid}>
            Submit
          </button>
          <button type="button" className="btn btn-default" onClick={reset} disabled={!isEditing}>
            Reset
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewDoctor;
