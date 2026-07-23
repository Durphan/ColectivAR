import type { ErrorRequestHandler } from "express";
import logger from "../config/logger.js";
import type { IErrorPayload } from "../../types/api-response.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message } satisfies IErrorPayload);
};

export default errorHandler;
