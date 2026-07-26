import z from "zod";
import type { ErrorPayload } from "../types/errorPayload.js";
import { AppError } from "./AppError.js";

export function toErrorPayload(err: unknown): ErrorPayload {
  if (err instanceof z.ZodError) {
    return {
      code: 400,
      error: "VALIDATION_ERROR",
      message: err.message,
      detail: { issues: err.issues },
    };
  }

  if (err instanceof AppError) {
    return {
      code: err.statusCode,
      error: err.errorCode,
      message: err.message,
      detail: err.detail,
    };
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  return {
    code: 500,
    error: "INTERNAL_ERROR",
    message,
    detail: null,
  };
}
