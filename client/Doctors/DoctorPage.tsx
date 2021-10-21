import * as React from "react";
import { AxiosResponse } from "axios";

import { NewDoctor } from "./NewDoctor";
import { DoctorList } from "./DoctorList";

export type MutationResponse = AxiosResponse<{ success: boolean }>;

export const DoctorPage: React.FC = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <NewDoctor />
          </div>
          <div className="col-8 card">
            <DoctorList />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
