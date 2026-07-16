const baseUrl =
  "https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const log_level = process.env.LOG_LEVEL || "info";

if (!clientId || !clientSecret) {
  throw new Error(
    "Missing required environment variables: CLIENT_ID and CLIENT_SECRET must be set",
  );
}

const fullUrl = `${baseUrl}${clientId}&client_secret=${clientSecret}`;

export const config = {
  baseUrl,
  clientId,
  clientSecret,
  fullUrl,
  log_level,
};
