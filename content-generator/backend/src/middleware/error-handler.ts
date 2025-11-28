import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import { settings } from "../config";
import { errorResponse } from "../utils/response";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(
    new HttpError(404, `Route "${req.originalUrl}" not found`, {
      code: "NOT_FOUND"
    })
  );
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    if (settings.env !== "test") {
      console.error(`[HttpError] ${err.statusCode} ${err.message}`, err.details);
    }

    return res
      .status(err.statusCode)
      .json(errorResponse(err.message, { code: err.code, details: err.details }));
  }

  if (settings.env !== "test") {
    console.error("[UnhandledError]", err);
  }

  return res
    .status(500)
    .json(errorResponse("Internal server error", { code: "INTERNAL_SERVER_ERROR" }));
};
