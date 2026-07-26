export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "EXTERNAL_API_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly statusCode: number;
  readonly errorCode: ErrorCode;
  readonly detail: Record<string, unknown> | null;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    detail?: Record<string, unknown> | null,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.detail = detail ?? null;
  }
}
