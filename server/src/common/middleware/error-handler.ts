import type { ErrorRequestHandler } from "express";
import logger from "../config/logger.js";
import type { ErrorPayload } from "../../types/api-response.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err.message);
  logger.error(err.stack);
  logger.error(`Error en la solicitud: ${res.statusCode}`);
  res.status(500).json({ error: err.message } satisfies ErrorPayload);
};

export default errorHandler;
