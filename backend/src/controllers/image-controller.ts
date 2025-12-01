import type { Request, Response } from "express";
import type { GenerateImageInput } from "../schemas/image-schema";
import { ImageService } from "../services/image-service";
import { successResponse } from "../utils/response";

export class ImageController {
  constructor(private readonly service: ImageService) {}

  createImage = async (
    req: Request<unknown, unknown, GenerateImageInput>,
    res: Response
  ): Promise<void> => {
    const payload = req.body;

    const result = await this.service.generateImage(payload);

    res.status(200).json(successResponse(result));
  };
}
