import { z } from "zod";
import logger from "../common/config/logger";

export const envSchema = z.object({
  CLIENT_ID: z.string().min(1, "CLIENT_ID es requerida"),
  CLIENT_SECRET: z.string().min(1, "CLIENT_SECRET es requerida"),
  LOG_LEVEL: z.string().default("info"),
});

export let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missing = error.issues.map((i) => i.path.join(".")).join(", ");
    logger.error(`Missing required env vars: ${missing}\n`);
    process.exit(1);
  }
  throw error;
}
