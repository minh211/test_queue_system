import React, { Component } from "react";
import axios from "axios";
import { config } from "../Config/config";
import NewDoctor from "./NewDoctor";
import AllDoctors from "./AllDoctors";

class Doctors extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
      doctors: [],
      firstName: "",
      lastName: "",
      submitDisabled: true,
      resetDisabled: false,
    };
    this.initialState = this.state;

  }

  async componentDidMount() {
    this.refresh();
  }

  async refresh() {
    let doctors = (await axios.get(`${this.URL}/doctors/getalldoctors`)).data;
    this.setState({
      doctors,
    });
  }

  deleteDoctor = async (doctorId) => {
    try {
      let result = (
          await axios
              .delete(`${this.URL}/doctors/${doctorId}`, {
            doctorId
          })).data;
      if(result.success) {
      }
        let doctors = (await axios.get(`${this.URL}/doctors/getalldoctors`)).data;
        this.setState({
          doctors,
        })
    }
      catch (e) {
      console.log(e);
    }
  };

  toggleDuty = async (doctorId) => {
    try {
      let result = (
        await axios.post(`${this.URL}/doctors/toggleduty`, {
          doctorId,
        })
      ).data;

      if (result.success) {
        let doctors = [...this.state.doctors];
        for (let i = 0; i < doctors.length; i++) {
          if (doctors[i].doctorId === doctorId) {
            let toggleStatus = doctors[i].onDuty ? false : true;
            doctors[i].onDuty = toggleStatus;
            break;
          }
        }
        this.setState({
          doctors,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-4 card">
              <NewDoctor refresh={() => this.refresh()} />
            </div>
            <div className="col-8 card">
              <AllDoctors
                doctors={this.state.doctors}
                toggleDuty={this.toggleDuty}
                updateFirstName={this.updateFirstName}
                update={this.updateDoctor}
                delete={this.deleteDoctor}
                refresh={() => this.refresh()}
              />

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Doctors;
