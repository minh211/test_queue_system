import * as React from "react";

import { Doctor } from "../types";

export const useNames = (doctor?: Partial<Doctor>) => {
  const { initFirstName, initLastName, initOnDuty } = React.useMemo(() => {
    return {
      initFirstName: doctor?.firstName ?? "",
      initLastName: doctor?.lastName ?? "",
      initOnDuty: doctor?.onDuty ?? true,
    };
  }, [doctor?.firstName, doctor?.lastName, doctor?.onDuty]);

  const [firstName, setFirstName] = React.useState(initFirstName);
  const [lastName, setLastName] = React.useState(initLastName);
  const [onDuty, setOnDuty] = React.useState(initOnDuty);

  const reset = React.useCallback(() => {
    setFirstName(initFirstName);
    setLastName(initLastName);
    setOnDuty(initOnDuty);
  }, [initFirstName, initLastName, initOnDuty]);

  const errorMessages: string[] = React.useMemo(() => {
    const errorMessages = [];

    if (!firstName) {
      errorMessages.push("First name field is required.");
    }
    if (!lastName) {
      errorMessages.push("Last name field is required.");
    }

    return errorMessages;
  }, [firstName, lastName]);

  const isEditing = React.useMemo(() => {
    return firstName !== initFirstName || lastName !== initLastName || onDuty !== initOnDuty;
  }, [firstName, initFirstName, initLastName, initOnDuty, lastName, onDuty]);

  const isValid = React.useMemo(() => !!firstName && !!lastName, [firstName, lastName]);

  return React.useMemo(() => {
    return {
      firstName,
      lastName,
      onDuty,
      updateFirstName: setFirstName,
      updateLastName: setLastName,
      toggleDuty: () => setOnDuty((oldDuty) => !oldDuty),
      reset,
      errorMessages,
      isValid,
      isEditing,
      setFirstName,
      setLastName,
    };
  }, [isEditing, errorMessages, firstName, isValid, lastName, onDuty, reset]);
};
