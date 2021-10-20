import * as React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useNames } from "../Doctors/useNames";
import { AppContext } from "../context";

export const NewPatient: React.FC = () => {
  const {
    eventHandlers: { addPatient },
  } = React.useContext(AppContext);

  const {
    firstName,
    lastName,
    updateLastName,
    updateFirstName,
    errorMessages,
    isEditing: isEditingNames,
    isValid,
    reset: resetNames,
  } = useNames();

  const [gender, setGender] = React.useState("");
  const [birthday, setBirthday] = React.useState<Date | undefined>(undefined);
  const [caseDescription, setCaseDescription] = React.useState("");

  const reset = React.useCallback(() => {
    setGender("");
    setBirthday(undefined);
    setCaseDescription("");
    resetNames();
  }, [resetNames]);

  const isEditingPatient = React.useMemo(() => {
    return isEditingNames || gender !== "" || birthday !== null || caseDescription !== "";
  }, [birthday, caseDescription, gender, isEditingNames]);

  const submit = React.useCallback(async () => {
    addPatient({ firstName, lastName, caseDescription, birthday, gender }).then();
  }, [addPatient, birthday, caseDescription, firstName, gender, lastName]);

  return (
    <React.Fragment>
      <div className="container card" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div className="form-group" style={{ marginTop: "20px" }}>
          <h4 className="text-danger">New Patient</h4>
          {isEditingPatient && errorMessages.length > 0 && (
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
        <div className="form-group">
          <label className="text-info">Gender</label>
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="male"
              value="Male"
              onChange={(e) => setGender(e.target.value)}
              checked={gender === "Male"}
            />
            <label className="form-check-label" htmlFor="male">
              Male
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="female"
              value="Female"
              onChange={(e) => setGender(e.target.value)}
              checked={gender === "Female"}
            />
            <label className="form-check-label" htmlFor="female">
              Female
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="other"
              value="Other"
              onChange={(e) => setGender(e.target.value)}
              checked={gender === "Other"}
            />
            <label className="form-check-label" htmlFor="other">
              Other
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="birthday" className="text-info">
            Birthday
          </label>
        </div>
        <div className="form-group">
          <DatePicker
            className="form-control"
            id="birthday"
            placeholderText="Birthday"
            onChange={(e: Date) => setBirthday(e)}
            selected={birthday}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="form-group">
          <label htmlFor="caseDescription" className="text-info">
            Case Description
          </label>
          <textarea
            className="form-control"
            id="caseDescription"
            rows={3}
            onBlur={(e) => setCaseDescription(e.target.value)}
            onChange={(e) => setCaseDescription(e.target.value)}
            value={caseDescription}
          />
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!isValid}>
            Submit
          </button>
          <button
            type="button"
            className="btn btn-default btn-outline-danger "
            onClick={reset}
            disabled={!isEditingPatient}>
            Reset
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
