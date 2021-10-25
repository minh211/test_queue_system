// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import httpErrors from "http-errors";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express = require("express");
import type * as core from "express-serve-static-core";
import { BuildOptions, Model } from "sequelize";

export const createError = httpErrors;

export function asyncHandler<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query>(
  handler: (...args: Parameters<express.RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => void | Promise<void>
): express.RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (...args) => {
    const fnReturn = handler(...args);
    const next = args[args.length - 1];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Promise.resolve(fnReturn).catch(next);
  };
}

export type Named<T extends { firstName: string; lastName: string }> = Pick<T, "firstName" | "lastName">;

export type ModelStatic<T extends Model> = typeof Model & {
  new (values?: never, options?: BuildOptions): T;
};
