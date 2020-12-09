import { FieldError } from "../types/error";
import { UsernamePasswordInput } from "../types/user";
import { buildError } from "../utils/buildError";

export function validateRegister({
  email,
  username,
}: UsernamePasswordInput): FieldError[] | undefined {
  if (!email.includes("@")) {
    return [buildError("email", "should be a valid email")];
  }

  if (username.length <= 2) {
    return [buildError("username", "length must be greater than 2")];
  }

  if (username.includes("@")) {
    return [buildError("username", "cannot include an @")];
  }

  return;
}

export function validatePassword(password: string): FieldError[] | undefined {
  if (password.length <= 3) {
    return [buildError("password", "length must be greater than 3")];
  }

  return;
}
