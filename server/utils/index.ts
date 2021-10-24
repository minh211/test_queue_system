// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import httpErrors from "http-errors";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import expressAsyncHandler from "express-async-handler";

export const createError = httpErrors;
export const asyncHandler = expressAsyncHandler;
