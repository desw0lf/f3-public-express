import { type Response, type Request, type NextFunction } from "express";
import { Responses } from "@filen/s3/dist/responses.js";
import { getRequestLog } from "../logger.ts";
import type { ErrorWithStatus } from "../utils/error.ts";
import { type Logger } from "../logger.ts";

export const errors = (logger: Logger) => async (err: ErrorWithStatus, req: Request, res: Response, _next: NextFunction) => {
  if (!err) {
    return;
  }
  const statusCode = err.statusCode || 500;
  // Log error details
  await logger.log("error", {
    msg: err.message,
    req: getRequestLog(req),
    err: {
      ...err,
      statusCode
    }
  }, "Errors");
  // res.sendStatus(statusCode);
  await Responses.error(res, statusCode, err.message, err.description);
};