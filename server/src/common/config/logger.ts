import winston from "winston";
import type { Logger } from "winston";
import { config } from "./env.js";

const logger: Logger = winston.createLogger({
  level: config.log_level,
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});

export default logger;
