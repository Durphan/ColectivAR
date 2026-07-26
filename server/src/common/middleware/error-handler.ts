import type { ErrorRequestHandler } from "express";
import logger from "../config/logger.js";
import { toErrorPayload } from "../../errors/errorManager.js";
import { AppError } from "../../errors/AppError.js";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const payload = toErrorPayload(err);

  if (err instanceof AppError) {
    logger.warn(`[${err.errorCode}] ${err.message}`, {
      method: req.method,
      path: req.path,
      detail: err.detail,
    });
  } else {
    logger.error(`[INTERNAL_ERROR] ${payload.message}`, {
      method: req.method,
      path: req.path,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  res.status(payload.code).json(payload);
};

export default errorHandler;
