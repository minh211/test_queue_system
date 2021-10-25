import { createUser, generateToken } from "../services";
import { ResponseMessage } from "../types";
import { asyncHandler, createError } from "../utils";

export namespace SignInHandler {
  export type ReqBody = { username: string; password: string };
  export type ResBody = ResponseMessage | { accessToken: string };
}

export const signIn = asyncHandler<never, SignInHandler.ResBody, SignInHandler.ReqBody>(async (req, res, next) => {
  const { username, password } = req.body;

  const accessToken = await generateToken(username, password);

  if (accessToken) {
    res.status(200).json({ accessToken });
    return;
  }

  return next(createError(403, "Username or password incorrect"));
});

export namespace SignUpHandler {
  export type ReqBody = { username: string; password: string };
}

export const signUp = asyncHandler<never, never, SignUpHandler.ReqBody>(async (req, res) => {
  const { username, password } = req.body;

  await createUser(username, password);
  res.status(200).send();
});
