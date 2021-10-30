export * from "./urls";
export * from "./useNames";
export * from "./defaultEventHandlers";
export * from "./tickets-utils";
export * from "./useAxios";

export function validateRequired(value: string | undefined) {
  if (!value) {
    return "EMPTY_FIELD";
  }
  return undefined;
}
