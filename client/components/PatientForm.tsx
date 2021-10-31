import * as React from "react";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { ErrorMessage, Field, FormFooter, FormHeader } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import { RadioGroup } from "@atlaskit/radio";
import { DatePicker } from "@atlaskit/datetime-picker";
import TextArea from "@atlaskit/textarea";

import { AppContext } from "../AppContainer";
import { Patient } from "../types";

function validate(value: string | undefined) {
  if (value === "") {
    return "EMPTY_FIELD";
  }
  return undefined;
}

export const PatientForm: React.FC = () => {
  const { queue, eventHandlers } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <Form<Patient> onSubmit={eventHandlers.addPatient}>
        {({ formProps, reset }) => (
          <form {...formProps} name="native-validation-example">
            <FormHeader title="Patient information" />
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
            <Field label="Gender" name="gender" defaultValue="">
              {({ fieldProps }) => (
                <RadioGroup
                  {...fieldProps}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              )}
            </Field>
            <Field name="birthday" label="Birthday">
              {({ fieldProps }) => <DatePicker {...fieldProps} />}
            </Field>
            <Field label="Case description" name="description">
              {({ fieldProps }) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <TextArea resize="vertical" minimumRows={3} placeholder="Describe your case here" {...fieldProps} />
              )}
            </Field>
            <FormFooter>
              <ButtonGroup>
                <Button onClick={() => reset()}>Reset</Button>
                <Button type="submit" appearance="primary" isDisabled={!queue}>
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
