import express from "express";
import type { Express } from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import logger from "./src/common/config/logger.js";

const app: Express = express();
app.use(
  cors({
    origin: "*",
  }),
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganStream: { write: (message: string) => void } = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
app.use(morgan("combined", { stream: morganStream }));

export default app;
