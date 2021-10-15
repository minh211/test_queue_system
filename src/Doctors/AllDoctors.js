import React, { Component } from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {config} from "../Config/config";
import axios from "axios";

class AllDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      firstName: "",
      lastName: "",
      submitDisabled: true,
      resetDisabled: false,
      errorMessages: [],
    };
    this.initialState = this.state;

    this.URL = config.URL;

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  updateFirstName(value) {
    this.setState({
      firstName: value,
    });
    this.validate();
  }

  updateLastName(value) {
    this.setState({
      lastName: value,
    });
    this.validate();
  }

  validate() {
    let errorMessages = [];
    if (!this.state.firstName) {
      errorMessages.push("First name field is required.");
    }
    if (!this.state.lastName) {
      errorMessages.push("Last name field is required.");
    }
    this.setState({ errorMessages });
    if (errorMessages.length === 0) {
      this.setState({ submitDisabled: false });
    }
  }

   updateDoctor = async(doctorId) => {
    let {firstName, lastName} = this.state
     try {
     let result = ( await axios
         .put(`${this.URL}/doctors/${doctorId}`, {
           doctorId,
           firstName,
           lastName,
         })).data;
    if(result.success){
        this.setState(this.initialState);
        this.props.refresh();
        console.log(this.initialState);
      }
     }
     catch (e) {
       console.log(e);
     }

    this.setState({ submitDisabled: false, resetDisabled: false });
  };

  render() {
    return (
      <React.Fragment>
        <table
          className="table table-striped table-hover table-bordered"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <thead>
            <tr>
              <th className="text-info">First Name</th>
              <th className="text-info">Last Name</th>
              <th className="text-info">On Duty</th>
                <th className="text-info">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.doctors.length === 0 && (
              <tr>
                <td colSpan="6">No doctors. Add a doctor to start.</td>
              </tr>
            )}
            {this.props.doctors.length > 0 &&
              this.props.doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.firstName}</td>
                  <td>{doctor.lastName}</td>
                  <td width="100" align="center">
                    <input
                      type="checkbox"
                      onChange={() => this.props.toggleDuty(doctor.doctorId)}
                      checked={doctor.onDuty}
                    />
                  </td>
                  <td width="100" align="center">
                    <div>
                      <Button outline color="warning" size="sm" onClick={this.toggle}>
                        Update
                      </Button>
                      <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggle}
                          className={this.props.className}
                      >
                        <ModalHeader toggle={this.toggle}>Update Doctor</ModalHeader>

                        <ModalBody>
                          <div className="form-group" style={{ marginTop: "20px" }}>
                            {this.state.errorMessages.length > 0 && (
                                <div className="alert alert-danger" role="alert">
                                  {this.state.errorMessages.map((errorMessage) => (
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
                                onBlur={(e) => this.updateFirstName(e.target.value)}
                                onChange={(e) => this.updateFirstName(e.target.value)}
                                value={this.props.firstName}
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
                                onBlur={(e) => this.updateLastName(e.target.value)}
                                onChange={(e) => this.updateLastName(e.target.value)}
                                value={this.props.lastName}
                            />
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={() => this.updateDoctor(doctor.doctorId)} disabled={this.state.submitDisabled}
                          >
                            Edit
                          </Button>{" "}
                          <Button color="secondary" onClick={this.toggle}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </div>
                    <Button
                        outline
                        color="danger"
                        size="sm"
                        onClick={() => this.props.delete(doctor.doctorId)}
                    >Remove</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default AllDoctors;
