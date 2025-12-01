import type { Request, Response } from "express";
import type { UpdateActiveProvidersInput } from "../schemas/provider-schema";
import { ProviderService } from "../services/provider-service";
import { successResponse } from "../utils/response";

export class ProviderController {
  constructor(private readonly service: ProviderService) {}

  listProviders = (_req: Request, res: Response): void => {
    const overview = this.service.listProviders();
    res.json(successResponse(overview));
  };

  updateActiveProviders = async (
    req: Request<unknown, unknown, UpdateActiveProvidersInput>,
    res: Response
  ): Promise<void> => {
    const overview = await this.service.updateActiveProviders(req.body);
    res.status(200).json(successResponse(overview));
  };
}
