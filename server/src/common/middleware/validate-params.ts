import type { Request, Response, NextFunction } from "express";

export function validateRequiredParams(
  paramNames: string[],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    for (const name of paramNames) {
      const value =
        req.body?.[name] ?? req.params[name] ?? req.query[name];
      if (value === undefined || value === null || value === "") {
        res.status(400).json({ error: `Missing required parameter: ${name}` });
        return;
      }
    }
    next();
  };
}
