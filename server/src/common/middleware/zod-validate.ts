import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(
  schema: z.ZodSchema,
  source: "params" | "body" | "query",
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = new z.ZodError(error.issues);
        next(zodError);
        return;
      }
      next(error);
    }
  };
}
