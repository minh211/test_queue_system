import * as React from "react";
import Form, { ErrorMessage, Field, FormFooter, FormHeader } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";

import { Doctor } from "../types";
import { AppContext } from "../AppContainer";

function validate(value: string | undefined) {
  if (value === "") {
    return "EMPTY_FIELD";
  }
  return undefined;
}

export const NewDoctorPanel: React.FC = () => {
  const {
    eventHandlers: { addDoctor },
  } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <Form<Doctor> onSubmit={addDoctor}>
        {({ formProps, reset }) => (
          <form {...formProps} name="native-validation-example">
            <FormHeader title="Doctor information" />
            <Field label="First name" name="firstName" isRequired defaultValue="" validate={validate}>
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} placeholder="Albert" />
                  {error === "EMPTY_FIELD" && <ErrorMessage>First name is required</ErrorMessage>}
                </>
              )}
            </Field>
            <Field label="Last name" name="lastName" isRequired defaultValue="" validate={validate}>
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} placeholder="Einstein" />
                  {error === "EMPTY_FIELD" && <ErrorMessage>Last name is required</ErrorMessage>}
                </>
              )}
            </Field>
            <Field name="onDuty">
              {({ fieldProps }) => (
                <Checkbox {...fieldProps} value={"true"} size="large" label="On duty" name="checkbox-default" />
              )}
            </Field>
            <FormFooter>
              <ButtonGroup>
                <Button onClick={() => reset()}>Reset</Button>
                <Button type="submit" appearance="primary">
                  Submit
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>
    </React.Fragment>
  );
};
