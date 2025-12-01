import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "../errors/http-error";

export const validateRequest = <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(
        new HttpError(400, "Validation failed", {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues
        })
      );
    }

    req.body = parsed.data as T;
    return next();
  };
