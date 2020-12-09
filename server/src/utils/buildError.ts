import { FieldError } from "../types/error";

export function buildError(field: string, message: string): FieldError {
  return {
    field,
    message,
  };
}
