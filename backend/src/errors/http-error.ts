interface HttpErrorOptions {
  code?: string;
  details?: unknown;
  cause?: unknown;
}

export class HttpError extends Error {
  public readonly statusCode: number;

  public readonly code?: string;

  public readonly details?: unknown;

  constructor(statusCode: number, message: string, options: HttpErrorOptions = {}) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}
