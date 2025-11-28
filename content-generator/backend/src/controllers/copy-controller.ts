import type { Request, Response } from "express";
import type { GenerateCopyInput } from "../schemas/copy-schema";
import { CopyService } from "../services/copy-service";
import { successResponse } from "../utils/response";

export class CopyController {
  constructor(private readonly service: CopyService) {}

  createCopy = async (
    req: Request<unknown, unknown, GenerateCopyInput>,
    res: Response
  ): Promise<void> => {
    const payload = req.body;

    const result = await this.service.generateCopy(payload);

    res.status(200).json(successResponse(result));
  };
}
