import type { AppConfig } from "./types/app-config";

const baseUrl: string =
  "https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=";
const clientId: string | undefined = process.env.CLIENT_ID;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const log_level: string = process.env.LOG_LEVEL || "info";

const envValidator = {
  validate(): void {
    if (!clientId || !clientSecret || !baseUrl) {
      throw new Error(
        "Missing required environment variables: CLIENT_ID, CLIENT_SECRET and BASE_URL must be set",
      );
    }
  },
};

envValidator.validate();

const fullUrl: string = `${baseUrl}${clientId}&client_secret=${clientSecret}`;

export const config: AppConfig = {
  baseUrl,
  clientId,
  clientSecret,
  fullUrl,
  log_level,
};
