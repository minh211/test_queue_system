import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {config} from "../Config/config";
import axios from "axios";

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.URL = config.URL;
    this.initialState = {
      firstName: "",
      lastName: "",
      onDuty: true,
      submitDisabled: true,
      resetDisabled: false,
      errorMessages: [],
    };
    this.state = this.initialState;


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

  updateOnDuty() {
    let onDuty = this.state.onDuty;
    this.setState({
      onDuty: !onDuty,
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


  async update(doctorId) {

    let { firstName, lastName, onDuty } = this.state;

    await axios
        .put(`${this.URL}/doctors/${doctorId}`, {
          firstName,
          lastName,
          onDuty,
        })
        .then((response) => {
          this.setState(this.initialState);
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  reset() {
    this.setState(this.initialState);
  }


  sayHello() {
    console.log("hello earth");
    this.toggle();
  }

  render() {
    return (
      <div>
        <Button outline color="info" size="sm" onClick={this.toggle}>
         Edit
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Edit Doctor</ModalHeader>

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

              <label htmlFor="firstName" className="text-danger">
                First Name
              </label>
              <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="First Name"
                  onBlur={(e) => this.updateFirstName(e.target.value)}
                  onChange={(e) => this.updateFirstName(e.target.value)}
                  value={this.state.firstName}
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
                  onBlur={(e) => this.updateLastName(e.target.value)}
                  onChange={(e) => this.updateLastName(e.target.value)}
                  value={this.state.lastName}
              />
            </div>
            <div className="form-check" style={{ marginBottom: "20px" }}>
              <input
                  className="form-check-input"
                  type="checkbox"
                  id="onDuty"
                  onChange={() => this.updateOnDuty()}
                  checked={this.state.onDuty}
              />
              <label className="form-check-label" htmlFor="onDuty">
                On Duty
              </label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.update}>
              Edit
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )}
}

export default ModalExample;
