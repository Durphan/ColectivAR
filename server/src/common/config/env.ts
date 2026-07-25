import { parsedEnv } from "../../schemas/env.schema.js";
import type { AppConfig } from "./types/app-config";

const baseUrl: string =
  "https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=";

const { CLIENT_ID, CLIENT_SECRET, LOG_LEVEL } = parsedEnv;

const fullUrl: string = `${baseUrl}${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

export const config: AppConfig = {
  baseUrl,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  fullUrl,
  log_level: LOG_LEVEL,
};
