import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message: string, detail?: Record<string, unknown> | null) {
    super(message, 400, "VALIDATION_ERROR", detail);
    this.name = "ValidationError";
  }
}
