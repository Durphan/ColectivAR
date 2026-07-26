import { AppError } from "./AppError";

export class ExternalApiError extends AppError {
  constructor(message: string, detail?: Record<string, unknown> | null) {
    super(message, 502, "EXTERNAL_API_ERROR", detail);
    this.name = "ExternalApiError";
  }
}
