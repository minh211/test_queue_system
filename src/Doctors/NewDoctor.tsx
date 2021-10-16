import * as React from "react";
import axios from "axios";
import { baseUrl } from "../Config/config";

export interface NewDoctorProps {
  refresh(): void;
}

const NewDoctor: React.FC<NewDoctorProps> = (props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [onDuty, setOnDuty] = React.useState(true);
  const [submitDisabled, setSubmitDisabled] = React.useState(true);
  const [resetDisabled, setResetDisabled] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const validate = () => {
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
  };

  const updateFirstName = (value: string) => {
    setFirstName(value);
    validate();
  };

  const updateLastName = (value: string) => {
    setLastName(value);
    validate();
  };

  const updateOnDuty = () => {
    setOnDuty((oldOnDuty) => !oldOnDuty);
    validate();
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setOnDuty(true);
    setSubmitDisabled(true);
    setResetDisabled(false);
    setErrorMessages([]);
  };

  const submit = async () => {
    setSubmitDisabled(true);
    setResetDisabled(true);

    await axios
      .post(`${baseUrl}/doctors/adddoctor`, {
        firstName,
        lastName,
        onDuty,
      })
      .then(() => {
        reset();
        props.refresh();
      })
      .catch(function (error) {
        console.log(error);
      });

    setSubmitDisabled(false);
    setResetDisabled(false);
  };

  return (
    <React.Fragment>
      <div className="container card" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div className="form-group" style={{ marginTop: "20px" }}>
          <h4 className="text-danger">Add Doctor</h4>
          {errorMessages.length > 0 && (
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
        <div className="form-check" style={{ marginBottom: "20px" }}>
          <input className="form-check-input" type="checkbox" id="onDuty" onChange={updateOnDuty} checked={onDuty} />
          <label className="form-check-label" htmlFor="onDuty">
            On Duty
          </label>
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={submit} disabled={submitDisabled}>
            Submit
          </button>
          <button type="button" className="btn btn-default" onClick={reset} disabled={resetDisabled}>
            Reset
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewDoctor;
