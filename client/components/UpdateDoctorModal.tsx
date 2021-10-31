import * as React from "react";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import styled from "styled-components";

import { AppContext } from "../AppContainer";
import { Doctor } from "../types";

import { DoctorForm } from "./DoctorForm";

interface UpdateDoctorModalProps {
  toggleModal(): void;

  doctor: Doctor;
}

export const UpdateDoctorModal: React.FC<UpdateDoctorModalProps> = ({ toggleModal, doctor }) => {
  const { eventHandlers } = React.useContext(AppContext);

  const updateDoctor = React.useCallback(
    async (formData: Doctor) => {
      if (!doctor) {
        return;
      }

      eventHandlers.updateDoctor({ ...formData, doctorId: doctor.doctorId }).then(toggleModal);
    },
    [doctor, eventHandlers, toggleModal]
  );

  return (
    <ModalTransition>
      <Modal onClose={toggleModal}>
        <FormWrapper>
          <DoctorForm asModal onSubmit={updateDoctor} {...doctor} onSecondaryButtonClick={toggleModal} />
        </FormWrapper>
      </Modal>
    </ModalTransition>
  );
};

const FormWrapper = styled.div`
  padding: 20px;
`;
