import { RequestHandler } from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asyncHandler from "express-async-handler";

import { createUser, generateToken } from "../services";
import { ResponseMessage } from "../types";

export namespace SignInHandler {
  export type ReqBody = { username: string; password: string };
  export type ResBody = ResponseMessage | { accessToken: string };
}

export const signIn: RequestHandler<never, SignInHandler.ResBody, SignInHandler.ReqBody> = asyncHandler(
  async (req, res) => {
    const { username, password } = req.body;

    const accessToken = await generateToken(username, password);

    if (accessToken) {
      res.status(200).json({ accessToken });
    } else {
      res.status(403).send({ message: "Username or password incorrect" });
    }
  }
);

export namespace SignUpHandler {
  export type ReqBody = { username: string; password: string };
}

export const signUp: RequestHandler<never, never, SignUpHandler.ReqBody> = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  await createUser(username, password);
  res.status(200).send();
});
