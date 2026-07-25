import type z from "zod";

export class ZodError extends Error {
  public issues: z.ZodIssue[];

  constructor(issues: z.ZodIssue[]) {
    super("Zod validation error");
    this.issues = issues;
  }
}
