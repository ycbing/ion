import type { RequestHandler } from "express";
import morgan from "morgan";
import { settings } from "../config";

export const requestLogger: RequestHandler =
  settings.env === "test" ? (_req, _res, next) => next() : morgan("combined");
