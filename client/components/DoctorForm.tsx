import * as React from "react";
import Form, { ErrorMessage, Field, FormFooter, FormHeader, OnSubmitHandler } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";

import { Doctor } from "../types";
import { validateRequired } from "../utils";

export interface DoctorFormProps {
  firstName?: string;
  lastName?: string;
  asModal?: boolean;
  onSubmit: OnSubmitHandler<Doctor>;
  onSecondaryButtonClick?(): void;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
  firstName,
  lastName,
  asModal,
  onSecondaryButtonClick,
  onSubmit,
}) => {
  return (
    <Form<Doctor> onSubmit={onSubmit}>
      {({ formProps, reset }) => (
        <form {...formProps}>
          <FormHeader title={`Doctor ${asModal ? "Update" : "information"}`} />
          <Field
            label="First name"
            name="firstName"
            isRequired
            defaultValue={firstName ?? ""}
            validate={validateRequired}>
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} placeholder="Albert" />
                {error === "EMPTY_FIELD" && <ErrorMessage>First name is required</ErrorMessage>}
              </>
            )}
          </Field>
          <Field label="Last name" name="lastName" isRequired defaultValue={lastName ?? ""} validate={validateRequired}>
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} placeholder="Einstein" />
                {error === "EMPTY_FIELD" && <ErrorMessage>Last name is required</ErrorMessage>}
              </>
            )}
          </Field>
          {!asModal && (
            <Field name="onDuty">
              {({ fieldProps }) => (
                <Checkbox {...fieldProps} value={"true"} size="large" label="On duty" name="checkbox-default" />
              )}
            </Field>
          )}
          <FormFooter>
            <ButtonGroup>
              <Button onClick={() => (onSecondaryButtonClick ?? reset)()}>{asModal ? "Cancel" : "Reset"}</Button>
              <Button type="submit" appearance={asModal ? "warning" : "primary"}>
                {asModal ? "Update" : "Submit"}
              </Button>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};
