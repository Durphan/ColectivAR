import { z } from "zod";
import { ValidationError } from "../errors/ValidationError";

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
    throw new ValidationError(`Missing required env vars: ${missing}`, {
      issues: error.issues,
    });
  }
  throw error;
}
