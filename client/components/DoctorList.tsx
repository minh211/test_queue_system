import * as React from "react";
import DynamicTable from "@atlaskit/dynamic-table";
import { Checkbox } from "@atlaskit/checkbox";
import EmptyState from "@atlaskit/empty-state";
import Button, { ButtonGroup } from "@atlaskit/button";
import EditFilledIcon from "@atlaskit/icon/glyph/edit-filled";
import EditorRemoveIcon from "@atlaskit/icon/glyph/editor/remove";

import { AppContext } from "../AppContainer";
import { Doctor } from "../types";

import { UpdateDoctorModal } from "./UpdateDoctorModal";

export const DoctorList: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const {
    doctors,
    eventHandlers: { updateDoctor, deleteDoctor },
  } = React.useContext(AppContext);
  const [modal, setModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentDoctor, setCurrentDoctor] = React.useState<Doctor | undefined>(undefined);

  const toggleModal = React.useCallback(
    (doctorId: string) => {
      setModal((oldModal) => !oldModal);
      setCurrentDoctor(() => doctors.find((doctor) => doctor.doctorId === doctorId));
    },
    [doctors]
  );

  const toggleDuty = React.useCallback(
    async (doctor: Doctor) => {
      await updateDoctor({ ...doctor, onDuty: !doctor.onDuty });
    },
    [updateDoctor]
  );

  const handleDeleteDoctor = React.useCallback(
    async (doctorId: string) => await deleteDoctor(doctorId),
    [deleteDoctor]
  );

  if (!isLoading && doctors.length === 0) {
    return <EmptyState header="No doctors. Add a doctor to start." />;
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <DynamicTable
        head={{
          cells: [
            { key: "firstName", content: "First Name", width: 30 },
            { key: "lastName", content: "Last Name", width: 30 },
            { key: "onDuty", content: "On Duty", width: 10 },
            { key: "action", content: "", width: 25 },
          ],
        }}
        rows={doctors.map((doctor) => ({
          key: doctor.doctorId,
          cells: [
            { key: "firstName", content: doctor.firstName },
            { key: "lastName", content: doctor.lastName },
            {
              key: "onDuty",
              content: (
                <Checkbox
                  onChange={() => toggleDuty(doctor)}
                  isChecked={doctor.onDuty}
                  size="large"
                  name="checkbox-default"
                />
              ),
            },
            {
              key: "action",
              content: (
                <ButtonGroup>
                  <Button
                    onClick={() => toggleModal(doctor.doctorId)}
                    iconBefore={<EditFilledIcon label="Edit" size="small" />}
                    appearance="warning">
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    iconBefore={<EditorRemoveIcon label="Delete" size="small" />}
                    appearance="danger">
                    Delete
                  </Button>
                </ButtonGroup>
              ),
            },
          ],
        }))}
        page={currentPage}
        rowsPerPage={10}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        sortOrder="DESC"
        onSetPage={setCurrentPage}
      />
      {modal && currentDoctor && (
        <UpdateDoctorModal doctor={currentDoctor} toggleModal={() => setModal((oldModal) => !oldModal)} />
      )}
    </>
  );
};
