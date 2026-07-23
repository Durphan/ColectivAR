import type { Request, Response, NextFunction } from "express";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type WrapHandler = (req: Request, res: Response) => Promise<unknown>;

export function wrap(handler: WrapHandler) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await handler(req, res);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
